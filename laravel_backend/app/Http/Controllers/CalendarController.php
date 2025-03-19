<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalendarModel;
use App\Models\BulkSessionModel;
use App\Models\ConfirmSession;
use App\Models\AssignProviderModel;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
class CalendarController extends Controller
{
    public function AddSingleSessions(Request $request){
    
        $validatedData = $request->validate([
            'id'  => 'required|integer',
            'sessionType' => 'required|string',
            'date' => 'required|date',
            'selected_student' => 'required|string',
            'timeSlots' => 'required|array',
            'timeSlots.*.startTime' => 'required|string',
            'timeSlots.*.endTime' => 'required|string',
            'userRollID' => 'required|integer', 
        ], [
           
            'selected_student.required' => 'The selected student field is required.',
            'timeSlots.*.startTime.required' => 'Start time is required for each session.',
            'timeSlots.*.endTime.required' => 'End time is required for each session.',
            'timeSlots.*.endTime.after' => 'End time must be after start time.',
        ]);
      
       

        $existingAssignProvider = AssignProviderModel::where('provider_id', $validatedData['userRollID'])
        ->where('student_id', $validatedData['id']) 
        ->orderBy('start_date', 'asc') // Sort by earliest start date
        ->orderBy('end_date', 'desc') // Sort by latest end date
        ->get();
        
        $minStartDate = $existingAssignProvider->first()?->start_date; // Get the lowest start_date
        $maxEndDate = $existingAssignProvider->max('end_date'); // Get the highest end_date
    
        Log::info("Earliest Start Date: " . $minStartDate);
        Log::info("Latest End Date: " . $maxEndDate);
 
       // Check if the date is out of range
        if ($minStartDate && $maxEndDate) {
            if ($validatedData['date'] < $minStartDate || $validatedData['date'] > $maxEndDate) {
                return response()->json([
                    'errors' => ['date' => ['Session cannot be created outside the allowed date range']]
                ], 422);
            }
        }

        // -----------------------------------------------

    // -------------------Check Overlap----------------------------
    // Fetch existing sessions for the student on the given date
    $existingSessions = CalendarModel::where('student_id', $validatedData['id'])
    ->where('date', $validatedData['date'])
    ->get();

    Log::info("Existing Sessions1:", $existingSessions->toArray());

    $existingBulkSessions = BulkSessionModel::where('student_id', $validatedData['id'])
    ->where('start_date', '<=', $validatedData['date'])
    ->where('end_date', '>=', $validatedData['date'])
    ->whereRaw("FIND_IN_SET(DAYOFMONTH(?), session_dates)", [$validatedData['date']])
    ->exists();

   

    if ($existingBulkSessions) {
        return response()->json([
            'errors' => ['date' => ['A session with this date already exists.']]
        ], 422);
    }
    
    // ----------END---------Check Overlap----------------------------
// Get total assigned yearly hours for the provider




$totalAssignedHours = AssignProviderModel::where('provider_id', $validatedData['userRollID'])
    ->sum('yearly_hours');

// Get total used minutes from CalendarModel (single session)
$totalUsedMinutesSingleSession = CalendarModel::where('student_id', $validatedData['id'])
    ->selectRaw('SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 60) as total_minutes')
    ->value('total_minutes') ?? 0; // Default to 0 if null

// Get total used minutes from BulkSessionModel (bulk sessions)
$totalUsedMinutesBulkSession = BulkSessionModel::where('student_id', $validatedData['id'])
    ->selectRaw("session_dates, TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 60 as session_duration")
    ->get(); // Fetch all matching records

$totalMinutes = 0;

foreach ($totalUsedMinutesBulkSession as $session) {
    // Split session_dates into an array
    $sessionCount = count(explode(',', $session->session_dates ?? ''));
    
    // Multiply session duration by session count
    $totalMinutes += ($session->session_duration ?? 0) * $sessionCount;
}

// Convert total used minutes to hours
$totalUsedHoursSingleSession = $totalUsedMinutesSingleSession / 60;
$totalUsedHoursBulkSession = $totalMinutes / 60; // Fixed this line

// Calculate total used hours
$totalUsedHours = $totalUsedHoursSingleSession + $totalUsedHoursBulkSession;

// Logging for debugging
\Log::info("Total Assigned Hours: $totalAssignedHours, Total Used Hours: $totalUsedHours");

// Check if used hours exceed assigned hours
if ($totalUsedHours > $totalAssignedHours) {
    return response()->json([
        'status'  => 'error',
        'message' => 'You have exceeded your assigned hours.'
    ], 400);
}

// Continue processing if within allowed hours...

    //============Check the same time or not when create session============
    // Check for conflicts
    foreach ($validatedData['timeSlots'] as $slot) {
        $newStartTime = Carbon::parse($slot['startTime']);
        $newEndTime = Carbon::parse($slot['endTime']);
     // Log for debugging
       // Correct order of log statements
       Log::info('New Session Start Time: ' . $newStartTime);
       Log::info('New Session End Time: ' . $newEndTime);
       Log::info('Duration in minutes: ' . $newStartTime->diffInMinutes($newEndTime));

        // Enforce 8 AM to 10 PM rule
        $allowedStartTime = Carbon::parse('08:00:00');
        $allowedEndTime = Carbon::parse('22:00:00');

        // Log to Laravel log file (storage/logs/laravel.log)
        Log::info('New Session Start Time: ' . $newStartTime);
        Log::info('New Session End Time: ' . $newEndTime);

        if ($newStartTime < $allowedStartTime || $newEndTime > $allowedEndTime) {
            return response()->json([
                'errors' => ['timeSlots' => ['Session must be scheduled between 8 AM and 10 PM.']]
            ], 422);
        }

        if ($newStartTime >= $newEndTime) {
            return response()->json([
                'errors' => ['timeSlots' => ['Start time must be before end time.']]
            ], 422);
        }
      if ($newStartTime->diffInMinutes($newEndTime) > 180) { // 180 minutes = 3 hours
        Log::error('Session exceeds 3-hour limit.');
        return response()->json([
            'errors' => ['timeSlots' => ['Session duration cannot exceed 3 hours.']]
        ], 422);
    }

    // Enforce minimum session duration of 1 minute
     if ($newStartTime->diffInMinutes($newEndTime) < 1) { 
        Log::error('Session duration is too short.');
        return response()->json([
            'errors' => ['timeSlots' => ['Session duration must be at least 1 minute.']]
        ], 422);
    }

        foreach ($existingSessions as $session) {
            $existingStartTime = Carbon::parse($session->start_time);
            $existingEndTime = Carbon::parse($session->end_time);
    
            if (
                ($newStartTime->between($existingStartTime, $existingEndTime) || 
                $newEndTime->between($existingStartTime, $existingEndTime) ||  
                ($newStartTime <= $existingStartTime && $newEndTime >= $existingEndTime))
            ) {
                return response()->json([
                    'errors' => ['timeSlots' => ['Session time conflicts with an existing session.']]
                ], 422);
            }
        }
    }
    
        // -----------------------------------------------
    $sessions = [];
        foreach ($validatedData['timeSlots'] as $slot) {
            $sessions[] = [
                'student_id' => $validatedData['id'],
                'user_roll_id' => $validatedData['userRollID'],
                'student_name' => $validatedData['selected_student'],
                'session_name' => $validatedData['sessionType'],
                'date' => $validatedData['date'],
                'start_time' => $slot['startTime'],
                'end_time' => $slot['endTime'],
             
            ];
        }
    
        try {
           
            CalendarModel::insert($sessions);
            return response()->json(['message' => 'Session created '], 201);
        } catch (\Exception $e) {
            // Log the error and return a response
            Log::error('Error creating: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating '], 500);
        }
    
    
    }


    // public function FetchSingleSession($id,$roll_name)
    // {
    //     try {
    
    //         $SingleSession = CalendarModel::orderBy('id', 'desc')->get();
    //         // dd($students);
    //         return response()->json($SingleSession); 
    //     } catch (\Exception $e) {
    //         \Log::error('Error fetching: ' . $e->getMessage());
    //         return response()->json(['error' => 'Error fetching '], 500);
    //     }
    // }
// public function FetchSingleSession($id, $roll_name)
// {
//     try {
//         $SingleSession = CalendarModel::where('user_roll_id', $id)
//             // ->where('roll_name', $roll_name)
//             ->orderBy('id', 'desc')
//             ->first(); // Using first() instead of get() to fetch a single session

//         if (!$SingleSession) {
//             return response()->json(['error' => 'Session not found'], 404);
//         }

//         return response()->json($SingleSession);
//     } catch (\Exception $e) {
//         \Log::error('Error fetching session: ' . $e->getMessage());
//         return response()->json(['error' => 'Error fetching session'], 500);
//     }
// }

public function FetchSingleSession($id, $roll_name)
{
    try {
        if ($roll_name === 'Admin') {
            // If the user is an admin, fetch all sessions
            $sessions = CalendarModel::orderBy('id', 'desc')->get();
        } else {
            // Otherwise, fetch all sessions for the specific user
            $sessions = CalendarModel::where('user_roll_id', $id)
                ->orderBy('id', 'desc')
                ->get();
        }

        if ($sessions->isEmpty()) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        return response()->json($sessions);
    } catch (\Exception $e) {
        \Log::error('Error fetching session: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching session'], 500);
    }
}




    public function FetchBulkSessionDetails()
    {
        try {
    
            $BulkSessionDetails = BulkSessionModel::orderBy('id', 'desc')->get();
            // dd($students);
            return response()->json($BulkSessionDetails); 
        } catch (\Exception $e) {
            \Log::error('Error fetching: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching '], 500);
        }
    }


    public function AddBulkSession(Request $request)
{
    $validatedData = $request->validate([
        'id'  => 'required|integer',
        'selected_student'   => 'required|string',
        'sessionType' => 'required|string',
        'dayofweek'  => 'required|array',
        'startDate' => 'required|date',
        'endDate'         => 'required|date|after_or_equal:startDate',
        'sessions'  => 'required|array',
        'sessionDates'   => 'nullable|array',
        'userRollID' => 'required|integer', 
    ], [
        'selected_student.required' => 'The selected student field is required.',
        'sessionType.required' => 'Session type is required.',
        'dayofweek.required' => 'At least one day of the week is required.',
        'startDate.required' => 'Start date is required.',
        'endDate.required' => 'End date is required and must be after or equal to start date.',
        'sessions.required' => 'At least one session time slot is required.',
        // 'sessionDates.required' => 'Session dates are required.',
        'sessions.*.startTime.required' => 'Start time is required for each session.',
        'sessions.*.endTime.required' => 'End time is required for each session.',
    ]);

    $existingAssignProvider = AssignProviderModel::where('provider_id', $validatedData['userRollID'])
        ->where('student_id', $validatedData['id']) 
        ->orderBy('start_date', 'asc') // Sort by earliest start date
        ->orderBy('end_date', 'desc') // Sort by latest end date
        ->get();
        
        $minStartDate = $existingAssignProvider->first()?->start_date; // Get the lowest start_date
        $maxEndDate = $existingAssignProvider->max('end_date'); // Get the highest end_date
    
        Log::info("Earliest Start Date: " . $minStartDate);
        Log::info("Latest End Date: " . $maxEndDate);
 
       // Check if the date is out of range
        if ($minStartDate && $maxEndDate) {
            if ($validatedData['startDate'] < $minStartDate || $validatedData['endDate'] > $maxEndDate) {
                return response()->json([
                    'errors' => ['date' => ['Session cannot be created outside the allowed date range']]
                ], 422);
            }
        }

    $validatedData['dayofweek'] = is_array($validatedData['dayofweek'])
        ? implode(',', $validatedData['dayofweek'])
        : $validatedData['dayofweek']; 

        $validatedData['sessionDates'] = is_array($validatedData['sessionDates'])
        ? implode(',', $validatedData['sessionDates'])
        : $validatedData['sessionDates']; 
        
        $sessions = $validatedData['sessions']; // Array of session start & end times
    //   ---------------------------------------------------------------------
    // -------------------Check Overlap---------------------------------------
  // Fetch existing bulk session dates (stored as "1,2,3,4")
$existingBulkSessions = BulkSessionModel::where('student_id', $validatedData['id'])
->where('start_date', '<=', $validatedData['endDate'])
->where('end_date', '>=', $validatedData['startDate'])
->pluck('session_dates')
->toArray();

// Fetch existing single sessions with date & time
$singleSessions = CalendarModel::whereBetween('date', [$validatedData['startDate'], $validatedData['endDate']])
->where('student_id', $validatedData['id'])
->select('date', 'start_time', 'end_time')
->get();

// Convert stored bulk session dates (comma-separated) into an array
$existingBulkDates = [];
foreach ($existingBulkSessions as $dates) {
$existingBulkDates = array_merge($existingBulkDates, explode(',', $dates));
}
$existingBulkDates = array_unique($existingBulkDates); // Remove duplicates

// Convert single session dates into day numbers & map time slots
$existingSingleSessions = [];
foreach ($singleSessions as $single) {
$dayNumber = date('j', strtotime($single->date)); // Convert "YYYY-MM-DD" → "5"
$existingSingleSessions[$dayNumber] = [
    'start_time' => date('H:i', strtotime($single->start_time)),
    'end_time' => date('H:i', strtotime($single->end_time))
];
}

// Merge all existing session days (Bulk + Single)
$existingAllDates = array_unique(array_merge($existingBulkDates, array_keys($existingSingleSessions)));

// Get the selected session dates and remove duplicates
$sessionDates = explode(',', $validatedData['sessionDates']);
$sessionDates = array_map('trim', $sessionDates);
$sessionDates = array_unique($sessionDates);

// Filter out sessions that already exist in Bulk OR have time conflicts in Single
$filteredDates = [];
foreach ($sessionDates as $date) {
if (in_array($date, $existingAllDates)) {
    continue; // Skip if date already exists
}

foreach ($validatedData['sessions'] as $session) {
    $bulkStart = date('H:i', strtotime($session['startTime']));
    $bulkEnd   = date('H:i', strtotime($session['endTime']));

 // Enforce 8 AM to 8 PM rule
 if ($bulkStart < '08:00' || $bulkEnd > '22:00') {
    return response()->json([
        'errors' => ['sessions' => ['Sessions must be scheduled between 8 AM and 10 PM.']]
    ], 422);
}

    // Check if this date has a single session with the same time
    if (isset($existingSingleSessions[$date])) {
        $singleStart = $existingSingleSessions[$date]['start_time'];
        $singleEnd = $existingSingleSessions[$date]['end_time'];

        if ($bulkStart == $singleStart && $bulkEnd == $singleEnd) {
            Log::info(" Skipping $date: Time conflict ($bulkStart - $bulkEnd matches Single Session)");
            continue 2; // Skip this date
        }
    }
}

Log::info(" Adding $date to filteredDates");
$filteredDates[] = $date;
}

// If no new dates remain, return without inserting
if (empty($filteredDates)) {
return response()->json([
    'message' => 'All selected dates either already have sessions or have time conflicts. No new sessions created.'
], 200);
}

// Convert filtered dates back to a string and update validated data
$validatedData['sessionDates'] = implode(',', $filteredDates);


    // ===================================================

        try {
            foreach ($sessions as $session) {
                BulkSessionModel::create([
                    'student_id'   => $validatedData['id'],
                    'student_name' => $validatedData['selected_student'],
                    'session_name' => $validatedData['sessionType'],
                    'dayofweek'    => $validatedData['dayofweek'],
                    'start_date'   => $validatedData['startDate'],
                    'end_date'     => $validatedData['endDate'],
                    'start_time'   => $session['startTime'], // Save each session time
                    'end_time'     => $session['endTime'],
                    'session_dates' => implode(',', $filteredDates),
                ]);
            }
        return response()->json(['message' => 'Session created successfully!'], 201);
    } catch (\Exception $e) {
        // Log the error and return a response
        Log::error('Error creating session: ' . $e->getMessage());
        return response()->json(['message' => 'Error creating session.'], 500);
    }
}

public function deleteSession(Request $request)
{
    try {
        $sessionType = $request->input('session_type');
        $studentId = $request->input('student_id');
        $singleSessionDate = $request->input('single_session_date');
        $selectedDateConfirmSession = $request->input('selectedDateConfirmSession');
        $bulk_session_id = $request->input('bulk_session_id');
        
        // Validate required input
        if (!$sessionType || !$studentId) {
            return response()->json(['error' => 'Invalid input'], 400);
        }

        if ($sessionType === 'single') {
            // Delete from CalendarModel based on student_id and date
            $deleted = CalendarModel::where('student_id', $studentId)
                ->where('date', $singleSessionDate)
                ->delete();
        } else {
            // Handle bulk session deletion
            if ($selectedDateConfirmSession) {
                // Extract the day from the selected date (e.g., "2025-01-13" -> 13)
                $dayToDelete = \Carbon\Carbon::parse($selectedDateConfirmSession)->day;

                $bulkSession = BulkSessionModel::where('student_id', $studentId)
                    ->where('id', $bulk_session_id) // Filter by session ID
                    ->first();

                if ($bulkSession) {
                    // Convert session_dates (e.g., "6,13,20,27") to an array
                    $sessionDates = explode(',', $bulkSession->session_dates);

                    // Remove the day from the session_dates array
                    $updatedSessionDates = array_diff($sessionDates, [$dayToDelete]);

                    // If all dates were removed, ensure the field is empty
                    $updatedSessionDates = implode(',', $updatedSessionDates);

                    // Update the session_dates field with the new value
                    $bulkSession->session_dates = $updatedSessionDates;
                    $bulkSession->save();

                    return response()->json(['message' => 'Session date successfully deleted'], 200);
                } else {
                    return response()->json(['error' => 'Session not found'], 404);
                }
            } else {
                return response()->json(['error' => 'No session dates provided'], 400);
            }
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
    }
}


// 

public function CalendarConfirmSession(Request $request)
{
    try {
        // Convert 12-hour time to 24-hour format
        $startTime = date("H:i", strtotime($request->input('startTimeConfirmSession')));
        $endTime = date("H:i", strtotime($request->input('endTimeConfirmSession')));

        // Validate request data
        $validatedData = $request->validate([
            'session_type' => 'required|string',
            'student_id' => 'required|integer|exists:students,id',
            'selectedDateConfirmSession' => 'required|date',
            'userRollID' => 'required|integer|exists:providers,id',
        ]);

        // Check if session already exists
        $existingSession = ConfirmSession::where('student_id', $validatedData['student_id'])
                                         ->where('date', $validatedData['selectedDateConfirmSession'])
                                         ->exists();

        if ($existingSession) {
            return response()->json(['error' => 'Session already exists for this student on this date'], 409);
        }

        // Insert session
        ConfirmSession::create([
            'session_type' => $validatedData['session_type'],
            'student_id' => $validatedData['student_id'],
            'date' => $validatedData['selectedDateConfirmSession'],
            'start_time' => $startTime, // Converted format
            'end_time' => $endTime, // Converted format
            'provider_id' => $validatedData['userRollID'],
        ]);

        return response()->json(['message' => 'Session confirmed successfully'], 201);
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['error' => $e->errors()], 422);
    } catch (\Exception $e) {
        \Log::error('Session Confirmation Error: ' . $e->getMessage());
        return response()->json(['error' => 'Something went wrong.'], 500);
    }
}



public function FetchConfirmessionDetails()
    {
        try {
    
            $ConfirmSessionDetails = ConfirmSession::orderBy('id', 'desc')->get();
            // dd($students);
            return response()->json($ConfirmSessionDetails); 
        } catch (\Exception $e) {
            \Log::error('Error fetching: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching '], 500);
        }
    }
    



    public function UpdateSingleSession(Request $request)
    {
        try {
            // Log the incoming request data for debugging
            Log::info('Request Data:', $request->all());
    
            $validatedData = $request->validate([
                'student_id' => 'required|integer|exists:single_session,student_id', 
                'selectedStudentUpdateSingleSession' => 'required|array',
                'selectedDateConfirmSession' => 'required|date_format:Y-m-d', 
                'startTimeConfirmSession' => 'required',
                'endTimeConfirmSession' => 'required',
                'singlesessionAutoID' => 'required|integer|exists:single_session,id',
                'userRollID' => 'required|integer', 
            ]);
            $singlesessionAutoID = $validatedData['singlesessionAutoID']; 
            $startTime = Carbon::createFromFormat('h:i A', $validatedData['startTimeConfirmSession'])->format('H:i:s');
            $endTime = Carbon::createFromFormat('h:i A', $validatedData['endTimeConfirmSession'])->format('H:i:s');
    
            $existingAssignProvider = AssignProviderModel::where('provider_id', $validatedData['userRollID'])
            ->where('student_id', $validatedData['student_id']) 
            ->orderBy('start_date', 'asc') // Sort by earliest start date
            ->orderBy('end_date', 'desc') // Sort by latest end date
            ->get();
            
            $minStartDate = $existingAssignProvider->first()?->start_date; // Get the lowest start_date
            $maxEndDate = $existingAssignProvider->max('end_date'); // Get the highest end_date
        
            Log::info("Earliest Start Date: " . $minStartDate);
            Log::info("Latest End Date: " . $maxEndDate);
     
           // Check if the date is out of range
            if ($minStartDate && $maxEndDate) {
                if ($validatedData['selectedDateConfirmSession'] < $minStartDate || $validatedData['selectedDateConfirmSession'] > $maxEndDate) {
                    return response()->json([
                        'errors' => ['selectedDateConfirmSession' => ['Session cannot be created outside the allowed date range']]
                    ], 422);
                }
            }

            
    // -------------------Check Overlap----------------------------
    // Fetch existing sessions for the student on the given date
    // $existingSessions = CalendarModel::where('student_id', $validatedData['student_id'])
    // ->where('date', $validatedData['selectedDateConfirmSession'])
    // ->get();

    $existingSessions = CalendarModel::where('student_id', $validatedData['student_id'])
    ->where('date', $validatedData['selectedDateConfirmSession'])
    ->when(isset($validatedData['session_id']), function ($query) use ($validatedData) {
        return $query->where('id', '!=', $validatedData['singlesessionAutoID']);
    })
    ->get();


    Log::info("Existing Sessions22:", $existingSessions->toArray());

    $existingBulkSessions = BulkSessionModel::where('student_id', $validatedData['student_id'])
    ->where('start_date', '<=', $validatedData['selectedDateConfirmSession'])
    ->where('end_date', '>=', $validatedData['selectedDateConfirmSession'])
    ->whereRaw("FIND_IN_SET(DAYOFMONTH(?), session_dates)", [$validatedData['selectedDateConfirmSession']])
    ->exists();

   

    if ($existingBulkSessions) {
        return response()->json([
            'errors' => ['selectedDateConfirmSession' => ['A session with this date already exists.']]
        ], 422);
    }
    
    // ----------END---------Check Overlap----------------------------
//     $existingSingleSessions = CalendarModel::where('student_id', $validatedData['student_id'])
//     ->where('date', $validatedData['selectedDateConfirmSession'])
//     ->when(isset($validatedData['singlesessionAutoID']), function ($query) use ($validatedData) {
//         return $query->where('id', '!=', $validatedData['singlesessionAutoID']); // Exclude current session if updating
//     })
//     ->exists();

// if ($existingSingleSessions) {
//     return response()->json([
//         'errors' => ['selectedDateConfirmSession' => ['A session on this date already exists.']]
//     ], 422);
// }



$start = Carbon::parse($validatedData['startTimeConfirmSession']); // Auto-detects AM/PM
$end = Carbon::parse($validatedData['endTimeConfirmSession']);

Log::info("Parsed Start Time: " . $start->toTimeString());
Log::info("Parsed End Time: " . $end->toTimeString());

if ($start->greaterThanOrEqualTo($end)) {
    return response()->json([
        'errors' => ['time' => ['Start time must be before end time.']]
    ], 422);
}


    //============Check the same time or not when create session============
    // Check for conflicts
    
     
   // Check for overlapping time slots
   // Get new session start and end times
$newStartTime = Carbon::parse($validatedData['startTimeConfirmSession']);
$newEndTime = Carbon::parse($validatedData['endTimeConfirmSession']);

foreach ($existingSessions as $session) {
    // **Ensure we skip the session being updated**
    if ($session->id == $singlesessionAutoID) {
        continue;
    }

    $existingStartTime = Carbon::parse($session->start_time);
    $existingEndTime = Carbon::parse($session->end_time);

    if (
        ($newStartTime->gt($existingStartTime) && $newStartTime->lt($existingEndTime)) ||  // Starts inside another session
        ($newEndTime->gt($existingStartTime) && $newEndTime->lt($existingEndTime)) ||      // Ends inside another session
        ($newStartTime->lte($existingStartTime) && $newEndTime->gte($existingEndTime))     // Completely overlaps another session
    ) {
        return response()->json([
            'errors' => ['timeSlots' => ['Session time conflicts with an existing session.']]
        ], 422);
    }
}

    
    

        $studentData = $validatedData['selectedStudentUpdateSingleSession'];
        $studentName = $studentData['first_name'] . ' ' . $studentData['last_name'];

            // Update only the session with the matching ID
            $updated = CalendarModel::where('id', $validatedData['singlesessionAutoID'])
                // ->where('student_id', $validatedData['student_id'])
                ->update([
                    'student_name' => $studentName,
                    'date' => $validatedData['selectedDateConfirmSession'],
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                ]);
    
            if ($updated) {
               
                return response()->json(['message' => 'Session updated successfully'], 200);
            } else {
                return response()->json(['error' => 'Session not found or already updated'], 404);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', $e->errors());
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Session Update Error: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }


    public function DeleteFutureSession(Request $request)
{
    try {
        Log::info('DeleteFutureSession called', ['request_data' => $request->all()]);

        // Validate request data
        $validatedData = $request->validate([
            'student_id' => 'required|integer',
            'selectedStudentUpdateSingleSession' => 'required',
            'startTimeConfirmSession' => 'required|date_format:H:i:s',
            'selectedDateConfirmSession' => 'required|date',
            'endTimeConfirmSession' => 'required|date_format:H:i:s',
        ]);

        // Find the session
        $session = CalendarModel::where('student_id', $validatedData['student_id'])
         
            ->where('date', $validatedData['selectedDateConfirmSession'])
            
            ->first();

        if (!$session) {
            Log::warning('Session not found', ['validatedData' => $validatedData]);
            return response()->json(['message' => 'Session not found'], 404);
        }

        // Delete session
        $session->delete();
        Log::info('Session successfully deleted', ['session_id' => $session->id]);

        return response()->json(['message' => 'Session successfully deleted'], 200);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete session', 'details' => $e->getMessage()], 500);
    }
}



 
    public function assignProviderMinMaxDate($userRollID)
    {
        $existingAssignProvider = AssignProviderModel::where('provider_id', $userRollID)
            // ->where('student_id', $studentID)
            ->orderBy('start_date', 'asc') // Sort by earliest start date
            ->orderBy('end_date', 'desc') // Sort by latest end date
            ->get();
    
        $minStartDate = $existingAssignProvider->first()?->start_date; // Get the lowest start_date
        $maxEndDate = $existingAssignProvider->max('end_date'); // Get the highest end_date
     
        Log::info("Earliest ccc Start Date: " . $minStartDate);
        Log::info("Latest  End Date: " . $maxEndDate);
    
        return response()->json([
            'min_start_date' => $minStartDate,
            'max_end_date' => $maxEndDate
        ]);
    }
    
}



