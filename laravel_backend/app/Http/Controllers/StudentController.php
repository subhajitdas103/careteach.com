<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\Parents;
use App\Models\StudentServices;
// use App\Models\Student;
class StudentController extends Controller
{
    public function index(){
    return Student::all();
    }


    // public function fetchStudentData()
    // {
    //     $data = Students::all(); 
    //     return response()->json($data);
        
    // }
    public function fetchStudentData()
{
    try {
        // $students = Students::all(); 
        $students = Students::orderBy('id', 'desc')->get();// Fetch all students
        // dd($students);
        return response()->json($students); // Return data as JSON
    } catch (\Exception $e) {
        // Log the error to Laravel's log file
        \Log::error('Error fetching students: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching students'], 500);
    }
}


// ============================
public function addstudent(Request $request)
{
    try {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'grade' => 'nullable|string|max:255',
            'school_name' => 'nullable|string|max:255',
            'home_address' => 'nullable|string|max:255',
            'doe_rate' => 'nullable|string|max:255',
            'iep_doc' => 'nullable|string|max:255',
            'disability' => 'nullable|string|max:255',
            'nyc_id' => 'nullable|string|max:255',
            'notesPerHour' => 'nullable|numeric',
            'case_v' => 'nullable|string|max:255',
            'resolutionInvoice' => 'nullable|boolean',
            'status' => 'nullable|string|max:255',

            'parent_name' => 'nullable|string|max:255',
            'parent_email' => 'nullable|string|max:255',
            'parent_phnumber' => 'nullable|string|max:255',
            'parent_type' => 'nullable|string|max:255',

            // ........Service .......
            'services' => 'required|array',
            'services.*.service_type' => 'nullable|string|max:255',
            'services.*.startDate' => 'required|string|max:255',
            'services.*.endDate' => 'required|string|max:255',
            'services.*.weeklyMandate' => 'required|string|max:255',
            'services.*.yearlyMandate' => 'required|string|max:255',
                ]);

      // Process the services and save to the database
        foreach ($validatedData['services'] as $service) {
            StudentServices::create([
                'service_type' => $service['service_type'] ?? null,
                'start_date' => $service['startDate'],
                'end_date' => $service['endDate'],
                'weekly_mandate' => $service['weeklyMandate'],
                'yearly_mandate' => $service['yearlyMandate'],
            ]);
        }
        // dd($StudentServices);
        $parents = Parents::create([
            'parent_name' => $validatedData['parent_name'],
            'parent_email' => $validatedData['parent_email'],
            'ph_no' => $validatedData['parent_phnumber'],
            'parent_type' => $validatedData['parent_type'],
        ]);


        // Use the validated data to create the student
        $student = Students::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'grade' => $validatedData['grade'],
            'school_name' => $validatedData['school_name'],
            'home_address' => $validatedData['home_address'],
            'doe_rate' => $validatedData['doe_rate'],
            'iep_doc' => $validatedData['iep_doc'],
            'disability' => $validatedData['disability'],
            'nyc_id' => $validatedData['nyc_id'],
            'notes_per_hour' => $validatedData['notesPerHour'],
            'case' => $validatedData['case_v'],  // Save 'case_v' data into 'case' column
            'resulation_invoice' => $validatedData['resolutionInvoice'],
            'status' => $validatedData['status'],
        ]);

        return response()->json(['message' => 'Student data saved successfully!'], 201);
    } catch (\Exception $e) {
        \Log::error('Error saving student data: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}





}
