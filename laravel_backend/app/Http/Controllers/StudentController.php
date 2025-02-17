<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\Parents;
use App\Models\StudentServices;
use App\Models\AssignProviderModel;
use App\Models\Users;
use Carbon\Carbon;

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


// In StudentController.php

// In StudentController.php

public function fetchStudentDataCalendar($id, $userRollName)
{
    try {
        if ($userRollName == 'Admin') {
            $students = Students::all();
        } else {
            $assignProviders = AssignProviderModel::where('provider_id', $id)->get();
            $students = collect(); // Use a collection to avoid duplicates

            foreach ($assignProviders as $assignProvider) {
                $student = Students::find($assignProvider->student_id);
                if ($student) {
                    $students->push($student); // Add student to the collection
                }
            }

            $students = $students->unique('id')->values(); // Remove duplicates
        }

        return response()->json($students);

    } catch (\Exception $e) {
        \Log::error('Error fetching students: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching students'], 500);
    }
}



public function fetchStudentDataByRollID($id)
{
    try {
        // Fetch student data by roll_id
        $student = Students::where('roll_id', $id)->get();
      
        return response()->json($student);

    } catch (\Exception $e) {
        // Log the error message
        \Log::error('Error fetching students by provider: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching students by provider'], 500);
    }
}



// ============================
public function addstudent(Request $request)
{
    try {
        // Validation rules
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'grade' => 'required|string|max:255',
            'school_name' => 'required|string|max:255',
            'home_address' => 'required|string|max:255',
            'doe_rate' => 'required|string|max:255',
            'iep_doc' => 'nullable|string|max:255',
            'disability' => 'nullable|string|max:255',
            'nyc_id' => 'nullable|string|max:255',
            'notesPerHour' => 'nullable|numeric',
            'case_v' => 'nullable|string|max:255',
            'resolutionInvoice' => 'nullable|boolean',
            'status' => 'nullable|string|max:255',
            'userRollID' => 'required|integer',
            'parent_name' => 'required|string|max:255',
            'parent_email' => 'required|email|max:255',
            // 'parent_email' => 'required|email|max:255|unique:parents,parent_email',
            'parent_phnumber' => 'nullable|numeric',
            'parent_type' => 'required|string|max:255',

            'services' => 'required|array',
            'services.*.service_type' => 'required|string|max:255',
            'services.*.startDate' => 'required|string|max:255',
            'services.*.endDate' => 'required|string|max:255',
            'services.*.weeklyMandate' => 'required|numeric|max:168',
            'services.*.yearlyMandate' => 'required|numeric|max:8760',


        ], [
            'services.required' => 'At least one service is required.',
            'services.*.service_type.required' => 'Service type is required.',
            'services.*.startDate.required' => 'Start date is required.',
            'services.*.endDate.required' => 'End date is required.',
            'services.*.weeklyMandate.required' => 'Weekly mandate is required.',
            'services.*.weeklyMandate.max' => 'Weekly mandate was exceeded.',
            'services.*.yearlyMandate.required' => 'Yearly mandate is required.',
            'services.*.yearlyMandate.max' => 'Yearly mandate was exceeded.',
            // 'parent_email.unique' => 'The parent email has already been taken.',
        ]);

      
        // Create or update the parent
        $parents = Parents::create([
            'parent_name' => $validatedData['parent_name'],
            // 'ph_no' => $validatedData['parent_phnumber'],
            'ph_no' => $validatedData['parent_phnumber'] ?? '',
            'parent_type' => $validatedData['parent_type'],
            'parent_email' => $validatedData['parent_email'],
        ]);

        // Create or update the student
        $student = Students::create([
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
            'roll_id' => $validatedData['userRollID'],
        ]);

        // Insert the student services
        foreach ($validatedData['services'] as $service) {
            StudentServices::create([
                'student_id' => $student->id,
                'service_type' => $service['service_type'],
                'start_date' => $service['startDate'],
                'end_date' => $service['endDate'],
                'weekly_mandate' => $service['weeklyMandate'],
                'yearly_mandate' => $service['yearlyMandate'],
            ]);
        }

        return response()->json(['message' => 'Student data saved/updated successfully!'], 200);

    } catch (\Illuminate\Database\QueryException $e) {
        // // Handle unique constraint violation
        // if ($e->getCode() == 23000) {  // SQLSTATE[23000] is for integrity constraint violation
        //     return response()->json([
        //         'error' => 'The parent email has already been taken.'
        //     ], 400);
        // }
    
        // General error handling
        return response()->json([
            'error' => 'Internal Server Error',
            'message' => $e->getMessage(),
        ], 500);
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
            \Log::info('Update Status:', [$response]);
    
            return response()->json($response);
        } else {
            return response()->json(['error' => 'Student not found'], 404);
        }
    }
    
    public function search(Request $request)
{
    $query = $request->input('query');
    $userRollID = $request->input('userRollID');
    $userRollName = $request->input('userRollName');

    if ($userRollName === 'Admin') {
        // If the user is an admin, search all students
        $results = Students::where('first_name', 'like', '%' . $query . '%')
                          ->orWhere('last_name', 'like', '%' . $query . '%')
                          ->get();
    } else {
        // Get student IDs assigned to the provider
        $assignedStudentIDs = AssignProviderModel::where('provider_id', $userRollID)
                                    ->pluck('student_id');

        // Search only within assigned students
        $results = Students::whereIn('id', $assignedStudentIDs)
                          ->where(function ($queryBuilder) use ($query) {
                              $queryBuilder->where('first_name', 'like', '%' . $query . '%')
                                           ->orWhere('last_name', 'like', '%' . $query . '%');
                          })
                          ->get();
    }

    return response()->json($results);
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
