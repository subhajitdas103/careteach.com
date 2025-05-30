<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\Parents;
use App\Models\StudentServices;
use App\Models\Providers;
use App\Models\AssignProviderModel; 
use App\Models\User; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use DateTime;
use DateInterval;
use DatePeriod;

class ProviderController extends Controller
{

    public function SaveAssignProviderDetails(Request $request)
{
    try {
        $validatedData = $request->validate([
            'full_name' => 'nullable|string|max:255',
            'inputRateAssignProvider' => 'nullable|string|max:255',
            'selectedAssignProviderLocation' => 'nullable|string|max:255',
            'selectedAssignProviderService' => 'nullable|string|max:255',
            'inputWklyHoursAssignProvider' => 'required|string|max:255',
            'inputYearlyHoursAssignProvider' => 'required|string|max:255',
            'assignProviderStartDate' => 'nullable|string|max:255',
            'assignProviderEndDate' => 'nullable|string|max:255',
            'selectedProviderId' => 'required|integer',
            'id' => 'required|integer',
        ]);
        
        Log::info("Validated data: " . json_encode($validatedData));

        // ===========================================================
        // ✅ Step 2: Get Student Service Details
        $studentService = StudentServices::where('student_id', $validatedData['id'])
        ->where('service_type', $validatedData['selectedAssignProviderService'])
        ->first();

        if (!$studentService) {
        Log::info("Service not found for student ID: " . $validatedData['id']);
        return response()->json(['error' => 'Service not found'], 404);
        }

        $weeklyMandate = (int) $studentService->weekly_mandate;
        Log::info(" Student Service Details: Weekly Mandate = $weeklyMandate");

        // ✅ Step 3: Calculate Total Weekly Hours Used
        $totalWeeklyHoursUsed = AssignProviderModel::where('student_id', $validatedData['id'])
        ->where('service_type', $validatedData['selectedAssignProviderService'])
        ->where(function ($query) use ($validatedData) {
            $query->whereBetween('start_date', [$validatedData['assignProviderStartDate'], $validatedData['assignProviderEndDate']])
                ->orWhereBetween('end_date', [$validatedData['assignProviderStartDate'], $validatedData['assignProviderEndDate']]);
        })
        ->sum('wkly_hours');  // ✅ Sum weekly hours directly

        Log::info("🔢 Total Weekly Hours Used: $totalWeeklyHoursUsed");

        // ✅ Step 4: Validate Weekly Hours Limit
        $newAssignmentHours = (int) $validatedData['inputWklyHoursAssignProvider'];
        $remainingHours = $weeklyMandate - $totalWeeklyHoursUsed;

        if ($newAssignmentHours > $remainingHours) {
        Log::info("Assignment Rejected: Weekly limit exceeded! Weekly Mandate = $weeklyMandate, Used = $totalWeeklyHoursUsed, New = $newAssignmentHours");
        return response()->json([
            'error' => "Weekly hours limit exceeded! You have only $remainingHours hours left."
        ], 400);
        }
        
        // =============================================================

        $existingAssignServices = AssignProviderModel::where('student_id', $validatedData['id'])
        ->where('service_type', $validatedData['selectedAssignProviderService'])
        ->get();
    
        $AssignstartDates = $existingAssignServices->pluck('start_date')->map(fn($date) => Carbon::parse($date)->toDateString())->toArray();
        $AssignendDates = $existingAssignServices->pluck('end_date')->map(fn($date) => Carbon::parse($date)->toDateString())->toArray();
    
        Log::info('Assigned Service Dates', ['start_dates' => $AssignstartDates, 'end_dates' => $AssignendDates]);
    
        $existingService = StudentServices::where('student_id', $validatedData['id'])
        ->where('service_type', $validatedData['selectedAssignProviderService'])
        ->first();
        
        if ($existingService) {
            $startDateofSaveStudent = $existingService->start_date;
            $endDateofSaveStudent = $existingService->end_date;
        
            Log::info("Start Date: $startDateofSaveStudent, End Date: $endDateofSaveStudent");
        } else {
            Log::info("No existing service found.");
        }
    
        $newStartDate = Carbon::parse($validatedData['assignProviderStartDate']);
        $newEndDate   = Carbon::parse($validatedData['assignProviderEndDate']);
    
        $hasOverlap = false;
        foreach ($existingAssignServices as $service) {
            // Skip the record being updated
           if ( $service->provider_id != $validatedData['selectedProviderId']) {
        continue;
    }
    
            $serviceStart = Carbon::parse($service->start_date);
            $serviceEnd   = Carbon::parse($service->end_date);
    
            if ($newStartDate->lte($serviceEnd) && $newEndDate->gte($serviceStart)) {
                $hasOverlap = true;
                break;
            }
        }
    
        if ($hasOverlap) {
            return response()->json([
                'error' => 'The selected service dates overlap with an existing assigned service. Please choose different dates.'
            ], 400);
        }
        // ===================================================

        // Get the existing service record for the student and selected service type
        $existingService = StudentServices::where('student_id', $validatedData['id'])
        ->where('service_type', $validatedData['selectedAssignProviderService'])
        ->first();

        if (!$existingService || !$existingService->weekly_mandate) {
        return response()->json(['error' => 'No existing service or weekly mandate found for the student.'], 400);
        }

        $maxWeeklyMandate = $existingService->weekly_mandate;

        $startDate = Carbon::parse($validatedData['assignProviderStartDate']);
        $endDate = Carbon::parse($validatedData['assignProviderEndDate']);
    
     
        $service = $validatedData['selectedAssignProviderService'];
        
    
        Log::info("Max weekly mandate for service '$service': $maxWeeklyMandate");
    
        $requestedWeeklyHours = $validatedData['inputWklyHoursAssignProvider'];
      
        if ($requestedWeeklyHours > $maxWeeklyMandate) {
          
            return response()->json([
            
                 'error' => " The Weekly Hours Limit was $maxWeeklyMandate,in this Date Range"
            ], 400);
        }
    
     


        $AssignProvider = AssignProviderModel::create([
           
            'provider_name' => $validatedData['full_name'],
            'provider_rate' => $validatedData['inputRateAssignProvider'],
            'location' => $validatedData['selectedAssignProviderLocation'],
            'service_type' => $validatedData['selectedAssignProviderService'],
            'wkly_hours' => $validatedData['inputWklyHoursAssignProvider'],
            'yearly_hours' => $validatedData['inputYearlyHoursAssignProvider'],
            'start_date' => $validatedData['assignProviderStartDate'],
            'end_date' => $validatedData['assignProviderEndDate'],
            'student_id' =>$validatedData['id'],
            'provider_id' =>$validatedData['selectedProviderId'],
        ]);

        // Return a success response
        return response()->json(['message' => 'Provider data saved successfully!'], 201);
    } catch (\Exception $e) {
        \Log::error('Error saving provider data: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}

public function addprovider(Request $request)
{
    try {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'selectedDate' => 'nullable|string|max:255',
            'email' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'rate' => 'required|string|max:255',
            'rateNotes' => 'required|string|max:255',
            'selectedform' => 'required|string|max:255',
            'companyName' => 'required|string|max:255',
            'selectedGrades' => 'required|array',
            'licenseExpDateApplicable' => 'required|string|max:255',
            'licenseExpDate' => 'required|string|max:255',
            'petStatus' => 'required|string|max:255',
            'petsApprovalDate' => 'required|string|max:255',
            'bilingual' => 'required|string|max:255',
            'ssNumber' => 'required|string|max:255',
            'notes' => 'nullable|string|max:255',
            'status' => 'required|string|max:255',
            
           
                ]);

            $existingProviderEmail = Providers::where('provider_email', $validatedData['email'])->first();
            if ($existingProviderEmail) {
                return response()->json(['error' => 'Email is already associated with another provider.'], 400);
            }

        $validatedData['selectedGrades'] = is_array($validatedData['selectedGrades'])
        ? implode(',', $validatedData['selectedGrades'])
        : $validatedData['selectedGrades']; 


        $Providers = Providers::create([
            'provider_first_name' => $validatedData['first_name'],
            'provider_last_name' => $validatedData['last_name'],
            'provider_dob' => $validatedData['selectedDate'],
            'provider_email' => $validatedData['email'],
            'provider_phone' => $validatedData['phone'],
            'provider_address' => $validatedData['address'],
            'rate' => $validatedData['rate'],
            'rate_notes' => $validatedData['rateNotes'],
            'form' => $validatedData['selectedform'],
            'company_name' => $validatedData['companyName'],
            'grades_approved' => $validatedData['selectedGrades'],
            'license_exp_date_applicable' => $validatedData['licenseExpDateApplicable'],
            'license_exp_date' => $validatedData['licenseExpDate'],
            'pets_status' => $validatedData['petStatus'],
            'pets_approval_date' => $validatedData['petsApprovalDate'],
            'bilingual' => $validatedData['bilingual'],
            'ss_number' => $validatedData['ssNumber'],
            'notes' => $validatedData['notes'],
            'status' => $validatedData['status'],
         
        ]);

        User::create([
            'email' => $validatedData['email'],
            'name' => $validatedData['first_name'] . ' ' . $validatedData['last_name'],
            'roll_id' => $Providers->id, // Add the provider ID to the user
            'roll_name' => 'Provider', // Hardcoded value
            'password' => '$2y$10$FIJthcyu2R3/FA8HUcAvQe0impaNW2HlewVdmIuR9SosR8stXNH/K',
        ]);

        return response()->json(['message' => 'Student data saved successfully!'], 201);
    } catch (\Exception $e) {
        \Log::error('Error saving student data: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}


public function fetchProviderData()
{
    try {

        $providers = Providers::orderBy('id', 'desc')->get();
        // dd($students);
     
        return response()->json($providers); 
    } catch (\Exception $e) {
        \Log::error('Error fetching Providers: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching Providers'], 500);
    }
 
}
public function FetchAssignedProviders($id)
{
    try {
        // Fetch assigned providers for the given student_id
        $AssignedProviders = AssignProviderModel::where('student_id', $id)
            ->orderBy('id', 'desc')
            ->get();

        if ($AssignedProviders->isEmpty()) {
            return response()->json(['message' => 'No assigned providers found'], 404);
        }

        return response()->json($AssignedProviders);
    } catch (\Exception $e) {
        \Log::error('Error fetching Providers: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching Providers'], 500);
    }
}

// =====================================
public function fetchProviderDatabyRollID($id, $roll_name)
{
    try {
        if ($roll_name === 'Admin') {
            $Providers = Providers::orderBy('id', 'desc')->get();
        } else {
            $Providers = Providers::where('id', $id)
                ->orderBy('id', 'desc')
                ->get();
        }

        return response()->json($Providers);
    } catch (\Exception $e) {
        \Log::error('Error fetching Providers: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching Providers'], 500);
    }
}


public function deleteProvider($id)

    {
        try {
            // Find the provider by ID
            $providers = Providers::find($id);
            if (!$providers) {
                return response()->json(['message' => 'Providers not found'], 404);
            }

             // Delete users with matching role_id
            $deletedUsers = User::where('roll_id', $id)->delete();
            $providers->delete();

            return response()->json(['message' => 'Providers deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting providers: ' . $e->getMessage());

            return response()->json(['message' => 'Error deleting providers'], 500);
        }
    }


    public function DeleteAssignedProvidersFromDB($id)
    {
        // error_log('Received ID: ' . $id);  // Log the received ID for debugging purposes
    
        try {
            // Find the provider in the database using the provided ID
            $provider = AssignProviderModel::find($id);
          
                if (!$provider) {
                    return response()->json(['message' => 'Providers not found'], 404);
                }
                $provider->delete();
    
                return response()->json(['message' => 'Providers deleted successfully'], 200);
            } catch (\Exception $e) {
                Log::error('Error deleting providers: ' . $e->getMessage());
    
                return response()->json(['message' => 'Error deleting providers'], 500);
            }
    }


    

    public function FetchStudentOfAssignedProviders($id)
    {
      
        try {
            $students = DB::table('providers')
                ->join('assign_provider', 'providers.id', '=', 'assign_provider.provider_id')
                ->join('students', 'assign_provider.student_id', '=', 'students.id')
                ->where('providers.id', $id)
                ->select(
                    'students.id as student_id',
                    DB::raw("CONCAT(students.first_name, ' ', students.last_name) as student_name")
                )
                ->distinct() // Ensure unique student entries
                ->get();
               
    
            if ($students->isEmpty()) {
                return response()->json(['message' => 'No students found for this provider.'], 404);
            }
    
            return response()->json($students, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    

    
    public function fetchProviderById($id)
{
    try {
        // Fetch assigned providers for the given student_id
        $AssignedProviders = Providers::where('id', $id)
            ->orderBy('id', 'desc')
            ->get();

        if ($AssignedProviders->isEmpty()) {
            return response()->json(['message' => 'No assigned providers found'], 404);
        }

        return response()->json($AssignedProviders);
    } catch (\Exception $e) {
        \Log::error('Error fetching Providers: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching Providers'], 500);
    }
}

public function updateProvider($id, Request $request)
{
    // Find the provider by ID
    $provider = Providers::find($id);
    if (!$provider) {
        return response()->json(['message' => 'Provider not found'], 404);
    }

    // Check if the email is already associated with another provider (excluding the current provider)
    $existingProviderEmail = Providers::where('provider_email', $request->input('email'))
                                       ->where('id', '!=', $id)
                                       ->first();

    if ($existingProviderEmail) {
        return response()->json(['error' => 'Email is already associated with another provider.'], 400);
    }

  

// Get old name
$oldName = $provider->provider_first_name . ' ' . $provider->provider_last_name;

// Get new name from request
$newName = $request->input('first_name') . ' ' . $request->input('last_name');



    // Map request fields directly to database columns
    $dataToUpdate = [
        'provider_first_name' => $request->input('first_name'),
        'provider_last_name' => $request->input('last_name'),
        'provider_dob' => $request->input('selectedDate'),
        'provider_email' => $request->input('email'),
        'provider_phone' => $request->input('phone'),
        'provider_address' => $request->input('address'),
        'rate' => $request->input('rate'),
        'rate_notes' => $request->input('rateNotes'),
        'form' => $request->input('selectedform'),
        'company_name' => $request->input('companyName'),
        'grades_approved' => $request->input('selectedGrades'),
        'license_exp_date_applicable' => $request->input('licenseExpDateApplicable'),
        'license_exp_date' => $request->input('licenseExpDate'),
        'pets_status' => $request->input('petStatus'),
        'pets_approval_date' => $request->input('petsApprovalDate'),
        'bilingual' => $request->input('bilingual'),
        'ss_number' => $request->input('ssNumber'),
        'notes' => $request->input('notes'),
        'status' => $request->input('status'),
    ];

    if ($oldName !== $newName) {
        AssignProviderModel::where('provider_id', $id)->update(['provider_name' => $newName]);
    }
    // Update the provider's details
    $provider->update($dataToUpdate);

   

    return response()->json(['message' => 'Provider updated successfully'], 200);
}




public function searchProvider(Request $request)
{
   

    $query = trim($request->input('query'));
    $query = str_replace(' ', '+', $query); // Convert spaces back to '+'
    
    $Providers = Providers::where('provider_first_name', 'LIKE', "%{$query}%")
        ->orWhere('provider_last_name', 'LIKE', "%{$query}%")
        ->orWhere('provider_email', 'LIKE', "%{$query}%")
        ->get();
    return response()->json($Providers);
}





// public function updateAssignProvider(Request $request, $id)
// {
//     // Validate the incoming request
//     $validatedData = $request->validate([
//         'providerId' => 'required',
//         'full_name' => 'required|string|max:255',
//         'inputRateAssignProvider' => 'required|numeric',
//         'selectedAssignProviderLocation' => 'required|string',
//         'selectedAssignProviderService' => 'required|string',
//         'inputWklyHoursAssignProvider' => 'required|numeric',
//         'inputYearlyHoursAssignProvider' => 'required|numeric',
//         'assignProviderStartDate' => 'required|date',
//         'assignProviderEndDate' => 'required|date',
//         'id' => 'required|integer',
//     ]);

//     $updateData = [
//         'provider_id' => $validatedData['providerId'],
//         'provider_name' => $validatedData['full_name'],
//         'provider_rate' => $validatedData['inputRateAssignProvider'],
//         'location' => $validatedData['selectedAssignProviderLocation'],
//         'service_type' => $validatedData['selectedAssignProviderService'],
//         'wkly_hours' => $validatedData['inputWklyHoursAssignProvider'],
//         'yearly_hours' => $validatedData['inputYearlyHoursAssignProvider'],
//         'start_date' => $validatedData['assignProviderStartDate'],
//         'end_date' => $validatedData['assignProviderEndDate'],
//         'student_id' => $validatedData['id'],
//     ];

//     Log::info("Validated data: " . json_encode($validatedData));


//     $existingAssignServices = AssignProviderModel::where('student_id', $validatedData['id'])
//     ->where('service_type', $validatedData['selectedAssignProviderService'])
//     ->get();

//     $AssignstartDates = $existingAssignServices->pluck('start_date')->map(fn($date) => Carbon::parse($date)->toDateString())->toArray();
//     $AssignendDates = $existingAssignServices->pluck('end_date')->map(fn($date) => Carbon::parse($date)->toDateString())->toArray();

//     Log::info('Assigned Service Dates', ['start_dates' => $AssignstartDates, 'end_dates' => $AssignendDates]);

//     $existingService = StudentServices::where('student_id', $validatedData['id'])
//     ->where('service_type', $validatedData['selectedAssignProviderService'])
//     ->first();
    
//     if ($existingService) {
//         $startDateofSaveStudent = $existingService->start_date;
//         $endDateofSaveStudent = $existingService->end_date;
    
//         Log::info("Start Date: $startDateofSaveStudent, End Date: $endDateofSaveStudent");
//     } else {
//         Log::info("No existing service found.");
//     }

//     $newStartDate = Carbon::parse($validatedData['assignProviderStartDate']);
//     $newEndDate   = Carbon::parse($validatedData['assignProviderEndDate']);

//     $hasOverlap = false;
//     foreach ($existingAssignServices as $service) {
//         // Skip the record being updated
//         if ($service->id == $id) {
//             continue;
//         }

//         $serviceStart = Carbon::parse($service->start_date);
//         $serviceEnd   = Carbon::parse($service->end_date);

//         if ($newStartDate->lte($serviceEnd) && $newEndDate->gte($serviceStart)) {
//             $hasOverlap = true;
//             break;
//         }
//     }

//     if ($hasOverlap) {
//         return response()->json([
//             'error' => 'The selected service dates overlap with an existing assigned service. Please choose different dates.'
//         ], 400);
//     }
    

// // ==================================================================================================
//     if (!$existingService || !$existingService->weekly_mandate) {
//     return response()->json(['error' => 'No existing service or weekly mandate found for the student.'], 400);
//     }

//     $maxWeeklyMandate = $existingService->weekly_mandate;

//     // Log::info("Max weekly mandate for service '{$validatedData['selectedAssignProviderService']}': $maxWeeklyMandate");


//     // Get start and end dates
//     $startDate = Carbon::parse($validatedData['assignProviderStartDate']);
//     $endDate = Carbon::parse($validatedData['assignProviderEndDate']);

 
//     $service = $validatedData['selectedAssignProviderService'];
    

//     Log::info("Max weekly mandate for service '$service': $maxWeeklyMandate");

   
//     // $totalWeeks = $startDate->diffInWeeks($endDate) + 1;
//     $totalWeeks = ceil($startDate->diffInWeeks($endDate) + 1);
//     // $totalWeeks = ceil($startDate->diffInDays($endDate) / 7);

//     $allowedTotalHours = $totalWeeks * $maxWeeklyMandate;

//     Log::info("Total weeks: $totalWeeks, Allowed total hours: $allowedTotalHours");

//     // Requested hours from user input
//     $requestedWeeklyHours = $validatedData['inputWklyHoursAssignProvider'];
//     $requestedTotalHours = $totalWeeks * $requestedWeeklyHours;

//     Log::info("Requested weekly hours: $requestedWeeklyHours, Requested total hours: $requestedWeeklyHours");

//     // Ensure the requested weekly hours do not exceed the max mandate
//     if ($requestedWeeklyHours > $allowedTotalHours) {
//         // Log::error("Requested weekly hours ($requestedWeeklyHours) exceed max allowed ($allowedTotalHours)");
//         return response()->json([
//             // 'error' => "Requested weekly hours $requestedWeeklyHours exceed the allowed limit $allowedTotalHours Hours."
//              'error' => " The Weekly Hours Limit was $allowedTotalHours,in this Date Range"
//         ], 400);
//     }

//     // Ensure the requested total hours do not exceed the allowed total hours
//     if ($requestedWeeklyHours > $allowedTotalHours) {
//         // Log::error("Requested total hours ($requestedWeeklyHours) exceed allowed ($allowedTotalHours)");
//         return response()->json([
//             'error' => "Requested total hours  $requestedWeeklyHours exceed the allowed total $allowedTotalHours Hours."
//         ], 400);
//     }

//     if ($validatedData['inputWklyHoursAssignProvider'] == 0) {
//         return response()->json(['error' => 'Weekly hours must be greater than zero.'], 400);
//     }
    
//     if ($validatedData['inputYearlyHoursAssignProvider'] == 0) {
     
//         return response()->json(['error' => 'Yearly hours must be greater than zero.'], 400);
//     }



//     try {
      
//         \Log::info('Assign Provider Update Data:', $updateData);

//         $provider = AssignProviderModel::findOrFail($id);
//         $isUpdated = $provider->update($updateData);
        
//         // Log the update status
//         \Log::info('Update Status:', [$isUpdated]);

//         if (!$isUpdated) {
//             return response()->json(['error' => 'Failed to update the provider.'], 500);
//         }

//         return response()->json(['message' => 'Assign Provider updated successfully.'], 200);
//     } catch (Exception $e) {
//         return response()->json(['error' => 'An error occurred while updating the provider.', 'details' => $e->getMessage()], 500);
//     }
// }



public function updateAssignProvider(Request $request, $id)
{
    // Validate the incoming request
    $validatedData = $request->validate([
        'providerId' => 'required',
        'full_name' => 'required|string|max:255',
        'inputRateAssignProvider' => 'required|numeric',
        'selectedAssignProviderLocation' => 'required|string',
        'selectedAssignProviderService' => 'required|string',
        'inputWklyHoursAssignProvider' => 'required|numeric',
        'inputYearlyHoursAssignProvider' => 'required|numeric',
        'assignProviderStartDate' => 'required|date',
        'assignProviderEndDate' => 'required|date',
        'id' => 'required|integer',
    ]);

    $updateData = [
        'provider_id' => $validatedData['providerId'],
        'provider_name' => $validatedData['full_name'],
        'provider_rate' => $validatedData['inputRateAssignProvider'],
        'location' => $validatedData['selectedAssignProviderLocation'],
        'service_type' => $validatedData['selectedAssignProviderService'],
        'wkly_hours' => $validatedData['inputWklyHoursAssignProvider'],
        'yearly_hours' => $validatedData['inputYearlyHoursAssignProvider'],
        'start_date' => $validatedData['assignProviderStartDate'],
        'end_date' => $validatedData['assignProviderEndDate'],
        'student_id' => $validatedData['id'],
    ];
    // ===========================================================
    // ✅ Step 2: Get Student Service Details
    $studentService = StudentServices::where('student_id', $validatedData['id'])
    ->where('service_type', $validatedData['selectedAssignProviderService'])
    ->first();

    if (!$studentService) {
    Log::info("Service not found for student ID: " . $validatedData['id']);
    return response()->json(['error' => 'Service not found'], 404);
    }

    $weeklyMandate = (int) $studentService->weekly_mandate;
    Log::info(" Student Service Details: Weekly Mandate = $weeklyMandate");

    // ✅ Step 3: Calculate Total Weekly Hours Used
    $totalWeeklyHoursUsed = AssignProviderModel::where('student_id', $validatedData['id'])
    ->where('service_type', $validatedData['selectedAssignProviderService'])
    ->where(function ($query) use ($validatedData) {
        $query->whereBetween('start_date', [$validatedData['assignProviderStartDate'], $validatedData['assignProviderEndDate']])
            ->orWhereBetween('end_date', [$validatedData['assignProviderStartDate'], $validatedData['assignProviderEndDate']]);
    })
    ->where('id', '!=', $id)
    ->sum('wkly_hours');  // ✅ Sum weekly hours directly

    Log::info("🔢 Total Weekly Hours Used: $totalWeeklyHoursUsed");

    // ✅ Step 4: Validate Weekly Hours Limit
    $newAssignmentHours = (int) $validatedData['inputWklyHoursAssignProvider'];
    $remainingHours = $weeklyMandate - $totalWeeklyHoursUsed;

    if ($newAssignmentHours > $remainingHours) {
    Log::info("Assignment Rejected: Weekly limit exceeded! Weekly Mandate = $weeklyMandate, Used = $totalWeeklyHoursUsed, New = $newAssignmentHours");
    return response()->json([
        'error' => "Weekly hours limit exceeded! You have only $remainingHours hours left."
    ], 400);
    }
    
    // 

    $existingAssignServices = AssignProviderModel::where('student_id', $validatedData['id'])
        ->where('service_type', $validatedData['selectedAssignProviderService'])
        // ->where ('id',$id)
        ->get();

    Log::info("Existing Assigned Services: ", $existingAssignServices->toArray());

    $AssignstartDates = $existingAssignServices->pluck('start_date')->map(fn($date) => Carbon::parse($date)->toDateString())->toArray();
    $AssignendDates = $existingAssignServices->pluck('end_date')->map(fn($date) => Carbon::parse($date)->toDateString())->toArray();

    Log::info('Assigned Service Dates:', ['start_dates' => $AssignstartDates, 'end_dates' => $AssignendDates]);

    $existingService = StudentServices::where('student_id', $validatedData['id'])
        ->where('service_type', $validatedData['selectedAssignProviderService'])
        ->first();

    if ($existingService) {
        Log::info("Found Student Service - Start: {$existingService->start_date}, End: {$existingService->end_date}");
    } else {
        Log::info("No existing service found.");
    }

    // Convert input dates
    $newStartDate = Carbon::parse($validatedData['assignProviderStartDate']);
    $newEndDate = Carbon::parse($validatedData['assignProviderEndDate']);
// =========================================================================================
    // Overlap check for same provider_id
$hasOverlap = false;

if ($existingAssignServices->isNotEmpty()) {
    Log::info("Total existing services count: " . count($existingAssignServices));

    $count = 0;
    foreach ($existingAssignServices as $service) {
        $count++;
        Log::info("Loop iteration {$count}: Checking Service ID: " . (int) $service['id'] . " with Normal ID: " . (int) $id);

        Log::info("Final Total loop iterations: " . $count);

        // Skip self service comparison
        if ((int) $service->id === (int) $id) {
            Log::info("Skipping Service ID: {$service->id} (Same as Normal ID)");
            continue; // Skip self
        }

        // Check for overlap only if the provider_id matches
        if ((int) $service->provider_id !== (int) $validatedData['providerId']) {
            Log::info("Skipping Service ID: {$service->id} (Different Provider)");
            continue; // Skip services with different provider_id
        }

        $serviceStart = Carbon::parse($service->start_date);
        $serviceEnd = Carbon::parse($service->end_date);

        Log::info("Checking Overlap: New Start: {$newStartDate->toDateString()}, New End: {$newEndDate->toDateString()}, Existing Start: {$serviceStart->toDateString()}, Existing End: {$serviceEnd->toDateString()}");

        if ($newStartDate->lte($serviceEnd) && $newEndDate->gte($serviceStart)) {
            $hasOverlap = true;
            Log::error("Overlap detected for Student ID: {$validatedData['id']} and Service: '{$validatedData['selectedAssignProviderService']}'");
            break; // Break on first overlap detection
        }
    }
}

if ($hasOverlap) {
    return response()->json([
        'error' => 'The selected service dates overlap with an existing assigned service. Please choose different dates.'
    ], 400);
}

    

    if (!$existingService || !$existingService->weekly_mandate) {
        return response()->json(['error' => 'No existing service or weekly mandate found for the student.'], 400);
    }

    $maxWeeklyMandate = $existingService->weekly_mandate;

    // Calculate allowed weekly hours
    // $totalWeeks = ceil($newStartDate->diffInWeeks($newEndDate) + 1);
    // $allowedTotalHours = $totalWeeks * $maxWeeklyMandate;

    // Log::info("Total weeks: $totalWeeks, Allowed total hours: $allowedTotalHours");

    // Requested weekly and total hours
    $requestedWeeklyHours = $validatedData['inputWklyHoursAssignProvider'];
    // $requestedTotalHours = $totalWeeks * $requestedWeeklyHours;

    // Log::info("Requested weekly hours: $requestedWeeklyHours, Requested total hours: $requestedTotalHours");

    // Validate weekly and total hours
    if ($requestedWeeklyHours > $maxWeeklyMandate) {
        return response()->json([
            'error' => "The Weekly Hours Limit is $maxWeeklyMandate in this Date Range."
        ], 400);
    }

    if ($validatedData['inputWklyHoursAssignProvider'] == 0) {
        return response()->json(['error' => 'Weekly hours must be greater than zero.'], 400);
    }

    if ($validatedData['inputYearlyHoursAssignProvider'] == 0) {
        return response()->json(['error' => 'Yearly hours must be greater than zero.'], 400);
    }

    try {
        Log::info('Updating Assign Provider Data:', $updateData);

        $provider = AssignProviderModel::findOrFail($id);
        $isUpdated = $provider->update($updateData);

        Log::info('Update Status:', [$isUpdated]);

        if (!$isUpdated) {
            return response()->json(['error' => 'Failed to update the provider.'], 500);
        }

        return response()->json(['message' => 'Assign Provider updated successfully.'], 200);
    } catch (Exception $e) {
        Log::error('Error updating provider:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'An error occurred while updating the provider.', 'details' => $e->getMessage()], 500);
    }
}



public function fetch_start_end_date_of_student($studentId)
{
    $mandates = StudentServices::where('student_id', $studentId)
        ->select('weekly_mandate', 'yearly_mandate', 'start_date', 'end_date', 'service_type')
        ->get(); // Fetch all records instead of just one

    if ($mandates->isEmpty()) { // Check if no records are found
        return response()->json(['message' => 'No data found'], 404);
    }

    return response()->json($mandates);
}



}


  
    

    
