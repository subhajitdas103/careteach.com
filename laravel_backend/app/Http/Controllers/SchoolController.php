<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SchoolModel; 
use App\Models\Students;
// use App\Models\Parents;
// use App\Models\StudentServices;
// use App\Models\Providers;
// use App\Models\AssignProviderModel; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class SchoolController extends Controller
{
    public function addSchool(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'schoolName' => 'required|string',
            'principalName' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'workingDays' => 'required|string',
            'holidays' => 'required|string',
            'status' => 'required|string',
            'emailAddress' => 'required|string',
            'emailAddress' => 'required|email|unique:school,email',

        ], [
            'emailAddress.unique' => 'The email address is already registered.',
        ]);
    
        // Prepare the data to insert
        $dataToAdd = [
            'school_name' => $validatedData['schoolName'],
            'principal_name' => $validatedData['principalName'],
            'address' => $validatedData['address'],
            'phone' => $validatedData['phone'],
            'working_days' => $validatedData['workingDays'],
            'holiday' => $validatedData['holidays'],
            'email' => $validatedData['emailAddress'],
            'status' => $validatedData['status'],
        ];
    
        try {
            // Insert the data into the database
            SchoolModel::create($dataToAdd);
            return response()->json(['message' => 'School created successfully'], 201);
        } catch (\Exception $e) {
            // Log the error and return a response
            Log::error('Error creating school: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating school'], 500);
        }
    }
    

    public function SchoolData()
{
    try {

        $School = SchoolModel::orderBy('id', 'desc')->get();
        // dd($students);
        return response()->json($School); 
    } catch (\Exception $e) {
        \Log::error('Error fetching Providers: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching Providers'], 500);
    }
}
    


public function deleteSchooldata($id)

    {
        try {
            // Find the provider by ID
            $School = SchoolModel::find($id);
            if (!$School) {
                return response()->json(['message' => 'Providers not found'], 404);
            }
            $School->delete();

            return response()->json(['message' => 'Providers deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting School: ' . $e->getMessage());

            return response()->json(['message' => 'Error deleting School'], 500);
        }
    }
    
    // public function SearchSchool(Request $request)
    // {
    //     $query = $request->input('query');
    //     $school = SchoolModel::where('school_name', 'LIKE', "%{$query}%")
    //         ->orWhere('email', 'LIKE', "%{$query}%")
    //         ->get();
    //     return response()->json($school);
    // }
    public function SearchSchool(Request $request)
    {
        $query = trim($request->input('query'));
        $query = str_replace(' ', '+', $query); // Convert spaces back to '+'
    
        $school = SchoolModel::where('school_name', 'LIKE', "%{$query}%")
            ->orWhere('email', 'LIKE', "%{$query}%")
            ->get();
    
        return response()->json($school);
    }
    
    
    public function FetchSchoolDataBYID($id)
    {
        try {
            $SchoolData = SchoolModel::where('id', $id)
                ->orderBy('id', 'desc')
                ->get();
    
            if ($SchoolData->isEmpty()) {
                return response()->json(['message' => 'No assigned providers found'], 404);
            }
    
            return response()->json($SchoolData);
        } catch (\Exception $e) {
            \Log::error('Error fetching Providers: ' . $e->getMessage());
            return response()->json(['error' => 'Error fetching Providers'], 500);
        }
    }

    public function editschool(Request $request, $id)
{
    try {
        // Validate the incoming data
        $validatedData = $request->validate([
            'schoolName' => 'required|string',
            'principalName' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'workingDays' => 'required|string',
            'holidays' => 'required|string',
            'status' => 'required|string',
            'emailAddress' => 'required|email|unique:school,email,' . $id,  // Ensure 'schools' is the correct table name
        ], [
            'emailAddress.unique' => 'The email address is already registered.',
        ]);
        
        // Prepare the data to update
        $dataToUpdate = [
            'school_name' => $validatedData['schoolName'], 
            'principal_name' => $validatedData['principalName'],
            'address' => $validatedData['address'],
            'phone' => $validatedData['phone'],
            'working_days' => $validatedData['workingDays'],
            'holiday' => $validatedData['holidays'],
            'email' => $validatedData['emailAddress'],
            'status' => $validatedData['status'],
        ];

        // Find the school by ID
        $school = SchoolModel::find($id);
        
        if (!$school) {
            return response()->json(['error' => 'School not found'], 404);
        }

        // Update the school data
        $school->update($dataToUpdate);


         // Update the school_name in StudentModel for all students linked to this school
         Students::where('school_id', $id)->update(['school_name' => $validatedData['schoolName']]);

        // Return a success message
        return response()->json(['message' => 'School updated successfully!'], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        // Catch validation errors and return detailed information
        \Log::error('Validation failed: ' . $e->getMessage());
        return response()->json([
            'error' => 'Validation error',
            'details' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        // Log the general exception error
        \Log::error('Error updating school data: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}

    


}

    

    
