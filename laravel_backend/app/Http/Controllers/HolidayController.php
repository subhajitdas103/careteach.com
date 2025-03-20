<?php

namespace App\Http\Controllers;
use App\Models\HolidayModel; 
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class HolidayController extends Controller
{
    //
    public function addHoliday(Request $request)
    {
        // Log::info('Request Data:', $request->all());
        // Validate the incoming request

        $validatedData = $request->validate([
            'holidayName' => 'required|string',
            'startDate' => 'required|string',
            'endDate' => 'required|string',

        ]);
     
        // Prepare the data to insert
        $dataToAdd = [
            'name' => $validatedData['holidayName'],
            'start_date' => $validatedData['startDate'],
            'end_date' => $validatedData['endDate'],
        ];
    
        try {
            // Insert the data into the database
            HolidayModel::create($dataToAdd);
            return response()->json(['message' => 'Holiday created successfully'], 201);
        } catch (\Exception $e) {
            // Log the error and return a response
            Log::error('Error creating holiday: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating holiday'], 500);
        }
    }

    public function holidayData()
    {
        try {
            $Holiday = HolidayModel::orderBy('id', 'desc')->get();
    
            // Logging properly
            Log::info('Request Data:', ['holiday' => $Holiday]);
    
            return response()->json($Holiday);
        } catch (\Exception $e) {
            \Log::error('Error fetching Holidays: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching holidays'], 500);
        }
    }
    public function DeleteHoliday($id)

    {
        try {
            // $student = Student::find($id);
            $holiday = HolidayModel::find($id);
            if (!$holiday) {
                return response()->json(['message' => 'Holidy not found'], 404);
            }
            $holiday->delete();

            return response()->json(['message' => 'Holiday deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting students: ' . $e->getMessage());

            return response()->json(['message' => 'Error deleting services'], 500);
        }
    }
    public function FetchholidayDataBYID($id)
    {
        try {
            $HolidayData = HolidayModel::where('id', $id)->first();
    
            if (!$HolidayData) {
                return response()->json(['message' => 'No holiday found'], 404);
            }
    
            return response()->json($HolidayData);
        } catch (\Exception $e) {
            \Log::error('Error fetching holidays: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching holidays'], 500);
        }
    }
   

    public function editholiday(Request $request, $id)
    {
        try {
            // Validate the incoming data
            $validatedData = $request->validate([
                'holidayName' => 'required|string',
                'startDate' => 'required|string',
                'endDate' => 'required|string',
            ]);
            
            // Prepare the data to update
            $dataToUpdate = [
                'name' => $validatedData['holidayName'], 
                'start_date' => $validatedData['startDate'],
                'end_date' => $validatedData['endDate'],
            ];
    
            // Find the holiday by ID
            $holiday = HolidayModel::find($id);
            
            if (!$holiday) {
                return response()->json(['error' => 'Holiday not found'], 404);
            }
    
            // Update the holiday data
            $holiday->update($dataToUpdate);
    
            // Return a success message
            return response()->json(['message' => 'Holiday updated successfully!'], 200);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Catch validation errors and return detailed information
            \Log::error('Validation failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Validation error',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Log the general exception error
            \Log::error('Error updating holiday data: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
