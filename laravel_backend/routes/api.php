<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProviderController;


Route::get('/user', function (Request $request) { 
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/student',[StudentController::class,'index']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/Students',[StudentController::class,'fetchStudentData']);
Route::middleware('auth:sanctum')->group(function () {
    // Protected routes
});
// <Route path="/EditStudent/:id" element={<EditStudent />} />

Route::delete('/DeleteStudent/{id}', [StudentController::class, 'DeleteStudent']);
Route::post('/addstudent', [StudentController::class,'addstudent']);
Route::post('/addprovider', [ProviderController::class,'addprovider']);
Route::get('/ViewProviders',[ProviderController::class,'fetchProviderData']);
Route::delete('/DeleteProvider/{id}', [ProviderController::class, 'deleteProvider']);
Route::get('/StudentDataFetchAsID/{id}', [StudentController::class, 'fetchStudentById']);
Route::post('/AssignProvider', [ProviderController::class,'SaveAssignProviderDetails']);
Route::get('/FetchAssignedProviders/{id}',[ProviderController::class,'FetchAssignedProviders']);

Route::delete('/DeleteAssignedProviders/{id}', [ProviderController::class, 'DeleteAssignedProviders']);
