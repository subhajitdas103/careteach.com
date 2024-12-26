<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SchoolModel; 
// use App\Models\Students;
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
    
    public function SearchSchool(Request $request)
    {
        $query = $request->input('query');
        $school = SchoolModel::where('school_name', 'LIKE', "%{$query}%")
            // ->orWhere('last_name', 'LIKE', "%{$query}%")
            ->get();
        return response()->json($school);
    }
    }
    

    
