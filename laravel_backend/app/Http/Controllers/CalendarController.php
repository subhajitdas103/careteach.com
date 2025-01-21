<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalendarModel;
use App\Models\BulkSessionModel;

class CalendarController extends Controller
{
    public function AddSingleSessions(Request $request){
    
        $validatedData = $request->validate([
            'id'  => 'required|integer',
            'sessionType' => 'required|string',
            'date' => 'required|date',
            'selected_student'   => 'required|string',
            'startTime' => 'required|date_format:H:i:s',
            'endTime' => 'required|date_format:H:i:s',
        ]);
    
        // Prepare the data to insert
        $dataToAdd = [
            'student_id' => $validatedData['id'],
            'student_name' => $validatedData['selected_student'],
            'session_name' => $validatedData['sessionType'],
            'date' => $validatedData['date'],
            'start_time' => $validatedData['startTime'],
            'end_time' => $validatedData['endTime'],
            
        ];
    
        try {
            // Insert the data into the database
            CalendarModel::create($dataToAdd);
            return response()->json(['message' => 'Session created '], 201);
        } catch (\Exception $e) {
            // Log the error and return a response
            Log::error('Error creating: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating '], 500);
        }
    

    }


    public function FetchSingleSession()
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




}

