<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalendarModel;
use App\Models\BulkSessionModel;
use App\Models\ConfirmSession;
use Illuminate\Support\Facades\Log;
class CalendarController extends Controller
{
    public function AddSingleSessions(Request $request){
    
        $validatedData = $request->validate([
            'id'  => 'required|integer',
            'sessionType' => 'required|string',
            'date' => 'required|date',
            'selected_student'   => 'required|string',
            'timeSlots' => 'required|array',
        ]);
        $sessions = [];
        // Prepare the data to insert
        // $dataToAdd = [
        //     'student_id' => $validatedData['id'],
        //     'student_name' => $validatedData['selected_student'],
        //     'session_name' => $validatedData['sessionType'],
        //     'date' => $validatedData['date'],
        //     'start_time' => $validatedData['startTime'],
        //     'end_time' => $validatedData['endTime'],
            
        // ];
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
            // Insert the data into the database
            //CalendarModel::create($dataToAdd);
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
        'startTime'       => 'required|date_format:H:i:s',
        'endTime'         => 'required|date_format:H:i:s|after:startTime',
        'sessionDates'   => 'required|array',
    ]);

    $validatedData['dayofweek'] = is_array($validatedData['dayofweek'])
        ? implode(',', $validatedData['dayofweek'])
        : $validatedData['dayofweek']; 

        $validatedData['sessionDates'] = is_array($validatedData['sessionDates'])
        ? implode(',', $validatedData['sessionDates'])
        : $validatedData['sessionDates']; 

      

    // Prepare the data to insert, encode dayofweek array to JSON
    $dataToAdd = [
        'student_id' => $validatedData['id'],
        'student_name' => $validatedData['selected_student'],
        'session_name' => $validatedData['sessionType'],
        'dayofweek' => $validatedData['dayofweek'], // Encode to JSON
        'start_date' => $validatedData['startDate'],
        'end_date' => $validatedData['endDate'],
        'start_time' => $validatedData['startTime'],
        'end_time' => $validatedData['endTime'],
        'session_dates' => $validatedData['sessionDates'],
    ];

    try {
        // Insert the data into the database
        BulkSessionModel::create($dataToAdd);
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
}


