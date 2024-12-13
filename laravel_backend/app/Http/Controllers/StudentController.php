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


    public function fetchStudentData()
{
    try {
        // $students = Students::all(); 
        $students = Students::orderBy('id', 'desc')->get();
        // dd($students);
        return response()->json($students);
    } catch (\Exception $e) {
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

        // Create parent record first
        $parents = Parents::create([
            'parent_name' => $validatedData['parent_name'],
            'parent_email' => $validatedData['parent_email'],
            'ph_no' => $validatedData['parent_phnumber'],
            'parent_type' => $validatedData['parent_type'],
        ]);

        // Create services records
        foreach ($validatedData['services'] as $service) {
            StudentServices::create([
                'service_type' => $service['service_type'] ?? null,
                'start_date' => $service['startDate'],
                'end_date' => $service['endDate'],
                'weekly_mandate' => $service['weeklyMandate'],
                'yearly_mandate' => $service['yearlyMandate'],
            ]);
        }

        // Now create student record with the parent_id
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
            'case' => $validatedData['case_v'],
            'resulation_invoice' => $validatedData['resolutionInvoice'],
            'status' => $validatedData['status'],
            'parent_id' => $parents->id, // Use the parent ID here
        ]);

        return response()->json(['message' => 'Student data saved successfully!'], 201);
    } catch (\Exception $e) {
        \Log::error('Error saving student data: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}




public function DeleteStudent($id)

    {
        try {
            // Find the provider by ID
            $students = Students::find($id);
            if (!$students) {
                return response()->json(['message' => 'students not found'], 404);
            }
            $students->delete();

            return response()->json(['message' => 'students deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting students: ' . $e->getMessage());

            return response()->json(['message' => 'Error deleting students'], 500);
        }
    }

//     public function fetchStudentById($id)
// {
//     // Find the student by ID
//     $student = Students::find($id);
//     // $student = Students::with('Parents')->find($id);

//     // Check if the student was found
//     if ($student) {
//         return response()->json($student);  // Return the student data as JSON
//     } else {
//         // Return a 404 error if student is not found
//         return response()->json(['error' => 'Student not found'], 404);
//     }
// }
    
public function fetchStudentById($id)
{
    // Find the student by ID
    $student = Students::find($id);

    if ($student) {
        // Convert the student model to an array
        // $studentData = $student->toArray();

        // Check if the parent_id is not null
        $parent = null;
        if ($student->parent_id !== null) {
            $parent = Parents::find($student->parent_id);
        }

        // Combine student and parent details
        $response = [
            'student' => $student,
            'parent' => $parent
        ];

        return response()->json($response);
    } else {
        return response()->json(['error' => 'Student not found'], 404);
    }
}


}
