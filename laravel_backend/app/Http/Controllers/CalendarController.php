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
            'selected_student.required' => 'The selected student field is required.',
            'timeSlots.*.startTime.required' => 'Start time is required for each session.',
            'timeSlots.*.endTime.required' => 'End time is required for each session.',
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

    Log::info("Existing Sessions:", $existingSessions->toArray());

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

    //============Check the same time or not when create session============
    // Check for conflicts
    foreach ($validatedData['timeSlots'] as $slot) {
        $newStartTime = Carbon::parse($slot['startTime']);
        $newEndTime = Carbon::parse($slot['endTime']);
    
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


    public function FetchSingleSession($id,$roll_name)
    {
        try {
    
            $SingleSession = CalendarModel::orderBy('id', 'desc')->get();
            // dd($students);
            return response()->json($SingleSession); 
        } catch (\Exception $e) {
            \Log::error('Error fetching: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching '], 500);
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
    // Fetch existing session dates for the student within the given range
$existingBulkSessions = BulkSessionModel::where('student_id', $validatedData['id'])
->where('start_date', '<=', $validatedData['endDate'])
->where('end_date', '>=', $validatedData['startDate'])
->pluck('session_dates') // Get only the session_dates column
->toArray();

// Convert stored session dates (comma-separated) into an array
$existingDates = [];
foreach ($existingBulkSessions as $dates) {
$existingDates = array_merge($existingDates, explode(',', $dates));
}
$existingDates = array_unique($existingDates); // Remove duplicates

// Filter out session dates that already exist
$sessionDates = explode(',', $validatedData['sessionDates']);
$filteredDates = array_diff($sessionDates, $existingDates); // Keep only new dates

// If no new dates remain, return without inserting
if (empty($filteredDates)) {
return response()->json([
    'message' => 'All selected dates already have sessions. No new sessions created.'
], 200);
}

// Convert filtered dates back to a string
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
                'selectedDateConfirmSession' => 'required|date_format:Y-m-d', 
                'startTimeConfirmSession' => 'required|date_format:h:i A',
                'endTimeConfirmSession' => 'required|date_format:h:i A',
                'singlesessionAutoID' => 'required|integer|exists:single_session,id',
                'userRollID' => 'required|integer', 
            ]);
    
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
    
            // Update only the session with the matching ID
            $updated = CalendarModel::where('id', $validatedData['singlesessionAutoID'])
                // ->where('student_id', $validatedData['student_id'])
                ->update([
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
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Session Update Error: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }
    

    
    
    

    
}


