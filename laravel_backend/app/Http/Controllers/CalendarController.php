<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalendarModel;
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
    // FetchSingleSession
}
