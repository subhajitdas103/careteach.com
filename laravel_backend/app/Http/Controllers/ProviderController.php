<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\Parents;
use App\Models\StudentServices;
use App\Models\Providers;
use App\Models\AssignProviderModel; 

class ProviderController extends Controller
{

    public function SaveAssignProviderDetails(Request $request)
{
    try {
       

        // Validate incoming data
        $validatedData = $request->validate([
            'full_name' => 'nullable|string|max:255',
            'inputRateAssignProvider' => 'nullable|string|max:255',
            'selectedAssignProviderLocation' => 'nullable|string|max:255',
            'selectedAssignProviderService' => 'nullable|string|max:255',
            'inputWklyHoursAssignProvider' => 'nullable|string|max:255',
            'inputYearlyHoursAssignProvider' => 'nullable|string|max:255',
            'assignProviderStartDate' => 'nullable|string|max:255',
            'assignProviderEndDate' => 'nullable|string|max:255',
            'selectedProviderId' => 'required|integer',
            'id' => 'required|integer',
        ]);

      


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
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'selectedDate' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'rate' => 'nullable|string|max:255',
            'rateNotes' => 'nullable|string|max:255',
            'selectedform' => 'nullable|string|max:255',
            'companyName' => 'nullable|string|max:255',
            'selectedGrades' => 'nullable|array',
            'licenseExpDateApplicable' => 'nullable|string|max:255',
            'licenseExpDate' => 'nullable|string|max:255',
            'petStatus' => 'nullable|string|max:255',
            'petsApprovalDate' => 'nullable|string|max:255',
            'bilingual' => 'nullable|string|max:255',
            'ssNumber' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            
           
                ]);

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

// =====================================
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


public function deleteProvider($id)

    {
        try {
            // Find the provider by ID
            $providers = Providers::find($id);
            if (!$providers) {
                return response()->json(['message' => 'Providers not found'], 404);
            }
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
    


    }
    

    
