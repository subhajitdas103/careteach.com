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


        foreach ($validatedData['services'] as $service) {
            $weeklyMandate = $service['weeklyMandate'];
            $yearlyMandate = $service['yearlyMandate'];
            $startDate = $service['startDate']; // Define startDate
            $endDate = $service['endDate'];  

            if (!empty($weeklyMandate) && !empty($yearlyMandate) && $weeklyMandate > $yearlyMandate) {
                return response()->json(['error' => 'Weekly Mandate cannot exceed Yearly Mandate'], 400);
            }
        }

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
        return response()->json([
            'error' => 'Internal Server Error',
            'message' => $e->getMessage(),
        ], 500);
    }
}






public function DeleteStudent($id)
{
    try {
        // Find the student by ID
        $students = Students::find($id);

        // Check if student exists
        if (!$students) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // Delete associated services (StudentServices) for the student
        $services = StudentServices::where('student_id', $id);
        
        // Check if services exist before deleting
        if ($services->exists()) {
            $services->delete();
        }

        // Now delete the student record
        $students->delete();

        return response()->json(['message' => 'Student and associated services deleted successfully'], 200);
    } catch (\Exception $e) {
        Log::error('Error deleting student and services: ' . $e->getMessage());

        return response()->json(['message' => 'Error deleting student and services'], 500);
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
            $validatedData = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'grade' => 'nullable|string|max:255',
                'school_name' => 'nullable|string|max:255',
                'home_address' => 'nullable|string|max:255',
                'doe_rate' => 'nullable|string|max:255',
                'iep_doc' => 'nullable|string|max:255',
                // 'iep_doc' => 'nullable|file|mimes:pdf,doc,docx|max:10048', // 2MB max

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
    
                // Service validation
                'services' => 'nullable|array',
                'services.*.id' => 'nullable|integer',
                'services.*.service_type' => 'nullable|string|max:255',
                'services.*.startDate' => 'nullable|string|max:255',
                'services.*.endDate' => 'nullable|string|max:255',
                'services.*.weeklyMandate' => 'nullable|numeric',
                'services.*.yearlyMandate' => 'nullable|numeric',
            ]);
    
            $student = Students::findOrFail($id);
    
            // Update or create parent record
            $parent = Parents::updateOrCreate(
                ['id' => $student->parent_id],
                [
                    'parent_name' => $validatedData['parent_name'],
                    'ph_no' => $validatedData['parent_phnumber'],
                    'parent_type' => $validatedData['parent_type'],
                    'parent_email' => $validatedData['parent_email'],
                ]
            );
    
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
                'parent_id' => $parent->id,
            ]);
    
///////////////////------------------------------------------------


            //--------------------------------------------
           
            $totalWeeklyHours = 0;
            $totalYearlyHours = 0;
    
            foreach ($validatedData['services'] as $service) {
                \Log::info("Processing Service ID: " . ($service['id'] ?? 'NEW'));
    
                // Validate weekly and yearly mandates
                if (!empty($service['weeklyMandate']) && !empty($service['yearlyMandate']) && $service['weeklyMandate'] > $service['yearlyMandate']) {
                    return response()->json(['error' => 'Weekly Mandate cannot exceed Yearly Mandate'], 400);
                }
    
                $existingService = StudentServices::find($service['id']);
    
                if ($existingService) {
                    $startDateFormatted = Carbon::parse($service['startDate']);
                    $endDateFormatted = Carbon::parse($service['endDate']);
                    $existingStartDate = Carbon::parse($existingService->start_date);
                    $existingEndDate = Carbon::parse($existingService->end_date);
    


                    if ($service['weeklyMandate'] == "" ){
                        return response()->json(['error' => 'It can not be empty'], 400);
                    }

                   
    
            // Check if the service type is assigned to the student in AssignProviderModel
                $assignedService = AssignProviderModel::where('student_id', $existingService->student_id)
                ->where('service_type', $existingService->service_type)
                ->first();

                    if ($assignedService) {
                        $assignedStartDate = Carbon::parse($assignedService->start_date);
                        $assignedEndDate = Carbon::parse($assignedService->end_date);

                        // Check if user tries to decrease the start or end date (i.e., moving within the range)
                        if ($startDateFormatted->gt($assignedStartDate)) {
                            return response()->json(['error' => 'Start Date cannot be decreased as it conflicts with the assigned service dates'], 400);
                        }

                        if  ($endDateFormatted->lt($assignedEndDate)) {
                            return response()->json(['error' => 'End Date cannot be decreased as it conflicts with the assigned service dates'], 400);
                        }

                    }


                    $testSum = AssignProviderModel::where('student_id', $existingService->student_id)
                    ->where('service_type', $existingService->service_type)
                    ->sum('yearly_hours');
                
                \Log::info("Yearly Hours Value:", [$testSum]);
                
                if ($service['yearlyMandate'] < $testSum) {
                    return response()->json(['error' => 'Yearly Hours Can not be decreased'], 400);
                }

                $testSumweekly = AssignProviderModel::where('student_id', $existingService->student_id)
                ->where('service_type', $existingService->service_type)
                ->min('wkly_hours');

                if ($service['weeklyMandate'] < $testSumweekly) {
                    return response()->json(['error' => 'Weekly Hours Can not be decreased'], 400);
                }
                
                }
    
                // Update or create service
                $updatedService = StudentServices::updateOrCreate(
                    ['id' => $service['id']],
                    [
                        'service_type' => $service['service_type'],
                        'start_date' => $service['startDate'],
                        'end_date' => $service['endDate'],
                        'weekly_mandate' => $service['weeklyMandate'],
                        'yearly_mandate' => $service['yearlyMandate'],
                        'student_id' => $student->id,
                    ]
                );
    
                \Log::info("Successfully Updated/Created Service ID: " . ($updatedService->id ?? 'NEW'), $updatedService->toArray());
    
                // Accumulate hours
                $totalWeeklyHours += $service['weeklyMandate'] ?? 0;
                $totalYearlyHours += $service['yearlyMandate'] ?? 0;
            }
    
            return response()->json([
                'message' => 'Student data updated successfully!',
                'totalWeeklyHours' => $totalWeeklyHours,
                'totalYearlyHours' => $totalYearlyHours,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error updating student data: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    
    
   
        public function uploadIEP(Request $request)
        {
          
                $request->validate([
                    'iep_doc' => 'required|file|mimes:pdf,doc,docx|max:102400', // 100MB max
                ], [
                    'iep_doc.max' => 'File size exceeds the maximum limit of 100MB.'
                ]);
            
                if ($request->hasFile('iep_doc')) {
                    $file = $request->file('iep_doc');
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $filePath = $file->storeAs('uploads/iep_docs', $fileName, 'public');
            
                    return response()->json([
                        'message' => 'File uploaded successfully!',
                        'fileName' => $fileName,
                        'fileUrl' => asset("storage/$filePath"),
                        'fileSize' => $file->getSize()
                    ], 200);
                }
            
                return response()->json(['message' => 'No file uploaded.'], 400);
            }
            

                public function deleteIEP($filename)
                {
                    $filePath = storage_path("app/public/uploads/iep_docs/" . $filename);
                
                    if (file_exists($filePath)) {
                        unlink($filePath);
                        return response()->json(['message' => 'File deleted successfully'], 200);
                    }
                
                    return response()->json(['message' => 'File not found'], 404);
                }
        
        
    
        public function getUploadedIEP($id)
        {
            $student = Students::where('id', $id)->first();
        
            // Check if student exists and has an IEP document
            if (!$student || !$student->iep_doc) {
                return response()->json(['message' => 'No file found'], 404);
            }
        
            // Ensure file exists in storage
            $filePath = storage_path("app/public/uploads/iep_docs/" . $student->iep_doc);
        
            if (!file_exists($filePath)) {
                return response()->json(['message' => 'File not found on server'], 404);
            }
        
            return response()->json([
                'file_name' => $student->iep_doc,
                'file_url' => asset('storage/uploads/iep_docs/' . $student->iep_doc),
                'file_type' => $student->file_type
            ]);
        }
        

        public function DeleteStudentService($id)
        {
         try {
        $service = StudentServices::find($id);

        \Log::info('Service data: ', ['service' => $service]);

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }
        // Check if the student has only one service
        $serviceCount = StudentServices::where('student_id', $service->student_id)->count();
        if ($serviceCount == 1) {
            return response()->json(['message' => 'Cannot delete the only remaining service'], 400);
        }
        $exists = AssignProviderModel::where('student_id', $service->student_id)
                                     ->where('service_type', $service->service_type)
                                     ->exists();

        if ($exists) {
            return response()->json(['message' => 'Cannot delete service, as it is assigned to a provider'], 400);
        }

        $service->delete();

        return response()->json(['message' => 'Service deleted successfully'], 200);
    } catch (\Exception $e) {
        Log::error('Error deleting service: ' . $e->getMessage());

        return response()->json(['message' => 'Error deleting service'], 500);
    }
}

        
}
