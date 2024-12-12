<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\Parents;
use App\Models\StudentServices;
use App\Models\Providers;

// first_name,
//       last_name,
//       selectedDate,
//       email,
//       phone,
//       address,
//       rate,
//       rateNotes,
//       selectedform,
//       companyName,
//       selectedGrades,
//       licenseExpDateApplicable,
//       licenseExpDate,
//       petStatus,
//       petsApprovalDate,
//       bilingual,
//       ssNumber,
//       notes,
//       status

class ProviderController extends Controller
{

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
    // $validatedData['selectedDate'] = Carbon::parse($validatedData['selectedDate'])->format('Y-m-d');
                $validatedData['selectedGrades'] = is_array($validatedData['selectedGrades'])
    ? implode(',', $validatedData['selectedGrades'])  // Convert array to comma-separated string
    : $validatedData['selectedGrades'];  // If it's not an array, jus
        // Use the validated data to create the student
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





}
