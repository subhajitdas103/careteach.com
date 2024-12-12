<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\Parents;
use App\Models\StudentServices;
use App\Models\Providers;

class ProviderController extends Controller
{

public function addprovider(Request $request)
{
    try {
        $validatedData = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
           
                ]);
        // Use the validated data to create the student
        $Providers = Providers::create([
            'provider_first_name' => $validatedData['first_name'],
            'provider_last_name' => $validatedData['last_name'],
         
        ]);

        return response()->json(['message' => 'Student data saved successfully!'], 201);
    } catch (\Exception $e) {
        \Log::error('Error saving student data: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}





}
