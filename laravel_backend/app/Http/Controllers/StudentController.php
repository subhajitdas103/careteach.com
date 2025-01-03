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
            'nyc_id' => 'nullable|string|max:255', // Removed the 'exists' rule for nyc_id validation
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

        // Find or create parent
        $parents = Parents::Create(
           
            [
                'parent_name' => $validatedData['parent_name'],
                'ph_no' => $validatedData['parent_phnumber'],
                'parent_type' => $validatedData['parent_type'],
                'parent_email' => $validatedData['parent_email'],
                
            ]
        );

        // Find or create student
        $student = Students::Create(
            
            [
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'grade' => $validatedData['grade'],
                'school_name' => $validatedData['school_name'],
                'home_address' => $validatedData['home_address'],
                'doe_rate' => $validatedData['doe_rate'],
                'iep_doc' => $validatedData['iep_doc'],
                'disability' => $validatedData['disability'],
                'notes_per_hour' => $validatedData['notesPerHour'],
                'nyc_id' => $validatedData['nyc_id'],
                'case' => $validatedData['case_v'],
                'resulation_invoice' => $validatedData['resolutionInvoice'],
                'status' => $validatedData['status'],
                'parent_id' => $parents->id,
            ]
        );

        foreach ($validatedData['services'] as $service) {
           
                // If no matching service exists, insert a new one
                StudentServices::create([
                    'student_id' => $student->id,  // Link to the student
                    'service_type' => $service['service_type'],
                    'start_date' => $service['startDate'],
                    'end_date' => $service['endDate'],
                    'weekly_mandate' => $service['weeklyMandate'],
                    'yearly_mandate' => $service['yearlyMandate'],
                ]);
            
        }

        return response()->json(['message' => 'Student data saved/updated successfully!'], 200);
    } catch (\Exception $e) {
        \Log::error('Error saving/updating student data: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}





public function DeleteStudent($id)

    {
        try {
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


    public function fetchStudentById($id)
    {
        $student = Students::find($id);
    
        if ($student) {
            $parent = Parents::find($student->parent_id);
 
            $StudentServices = StudentServices::where('student_id', $student->id)->get();

            $response = [
                'student' => $student,
                'parent' => $parent,
                'StudentServices' => $StudentServices
            ];
    
            return response()->json($response);
        } else {
            return response()->json(['error' => 'Student not found'], 404);
        }
    }
    
    public function search(Request $request)
    {
        $query = $request->input('query');
        $students = Students::where('first_name', 'LIKE', "%{$query}%")
            ->orWhere('last_name', 'LIKE', "%{$query}%")
            ->get();
        return response()->json($students);
    }


    // ============================
public function editstudent(Request $request, $id)
{
    try {
        // Validate the request data
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'grade' => 'nullable|string|max:255',
            'school_name' => 'nullable|string|max:255',
            'home_address' => 'nullable|string|max:255',
            'doe_rate' => 'nullable|string|max:255',
            'iep_doc' => 'nullable|string|max:255',
            'disability' => 'nullable|string|max:255',
            'nyc_id' => 'nullable|string|max:255', // Removed the 'exists' rule for nyc_id validation
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
            'services.*.id' => 'nullable|integer',
            'services.*.service_type' => 'nullable|string|max:255',
            'services.*.startDate' => 'required|string|max:255',
            'services.*.endDate' => 'required|string|max:255',
            'services.*.weeklyMandate' => 'required|string|max:255',
            'services.*.yearlyMandate' => 'required|string|max:255',
        ]);

        // Find the existing student or return an error if not found
        $student = Students::findOrFail($id);

        // Update the parent record where student_id matches parent_id
        $parent = Parents::where('id', $student->parent_id)->first();
        if ($parent) {
            $parent->update([
                'parent_name' => $validatedData['parent_name'],
                'ph_no' => $validatedData['parent_phnumber'],
                'parent_type' => $validatedData['parent_type'],
                'parent_email' => $validatedData['parent_email'],
            ]);
        } else {
            // Handle case where the parent does not exist (optional)
            $parent = Parents::create([
                'parent_name' => $validatedData['parent_name'],
                'ph_no' => $validatedData['parent_phnumber'],
                'parent_type' => $validatedData['parent_type'],
                'parent_email' => $validatedData['parent_email'],
            ]);
        }

        // Update student data
        $student->update([
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
            'parent_id' => $parent->id,  // Update with the correct parent_id
        ]);

        // Update or create services for the student
        foreach ($validatedData['services'] as $service) {
            StudentServices::updateOrCreate(
                ['id' => $service['id']],  // Match by service type
                [
                    'service_type' => $service['service_type'],
                    'start_date' => $service['startDate'],
                    'end_date' => $service['endDate'],
                    'weekly_mandate' => $service['weeklyMandate'],
                    'yearly_mandate' => $service['yearlyMandate'],
                    'student_id' => $student->id , 
                ]
            );
        }

        return response()->json(['message' => 'Student data updated successfully!'], 200);
    } catch (\Exception $e) {
        \Log::error('Error updating student data: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}

    
}
