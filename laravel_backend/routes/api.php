<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\CalendarController;
Route::get('/user', function (Request $request) { 
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/student',[StudentController::class,'index']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/Students',[StudentController::class,'fetchStudentData']);
Route::get('/StudentsByRollID/{id}',[StudentController::class,'fetchStudentDataByRollID']);
// Route::get('/Studentsincalendar/{id}',[StudentController::class,'fetchStudentDataCalendar']);
Route::get('/Studentsincalendar/{roll_id}/{name}', [StudentController::class, 'fetchStudentDataCalendar']);

// Route::get('/Students',[StudentController::class,'fetchStudentData']);
Route::middleware('auth:sanctum')->group(function () {
    // Protected routes
});

Route::delete('/DeleteAssignedProviders/{id}', [ProviderController::class, 'DeleteAssignedProvidersFromDB']);
Route::delete('/DeleteStudent/{id}', [StudentController::class, 'DeleteStudent']);
Route::post('/addstudent', [StudentController::class,'addstudent']);

Route::post('/addprovider', [ProviderController::class,'addprovider']);
Route::post('/UpdateProvider/{id}', [ProviderController::class,'updateprovider']);
Route::post('/EditSchool/{id}', [SchoolController::class,'editschool']);
Route::post('/UpdateAssignProvider/{id}', [ProviderController::class,'updateAssignProvider']);
Route::get('/ViewProviders',[ProviderController::class,'fetchProviderData']);
// Route::get('/ViewProvidersbyrollID/{id}',[ProviderController::class,'fetchProviderDatabyRollID']);
Route::get('/ViewProvidersbyrollID/{id}/{roll_name}', [ProviderController::class, 'fetchProviderDatabyRollID']);

Route::delete('/DeleteProvider/{id}', [ProviderController::class, 'deleteProvider']);
Route::get('/StudentDataFetchAsID/{id}', [StudentController::class, 'fetchStudentById']);
Route::post('/AssignProvider', [ProviderController::class,'SaveAssignProviderDetails']);
Route::get('/FetchAssignedProviders/{id}',[ProviderController::class,'FetchAssignedProviders']);
Route::get('/FetchStudentOfAssignedProviders/{id}',[ProviderController::class,'FetchStudentOfAssignedProviders']);

Route::get('/fetch_start_end_date_of_student/{id}',[ProviderController::class,'fetch_start_end_date_of_student']);


Route::get('/ProviderDataFetchAsID/{id}', [ProviderController::class, 'fetchProviderById']);
// Route::delete('/DeleteAssignedProviders/{id}',[ProviderController::class,'DeleteAssignedProviders']);
// Route::post('/AddSchool', [SchoolController::class,'addschool']);
Route::post('/AddSchool', [SchoolController::class, 'addSchool']);
Route::get('/fetchSchoolData',[SchoolController::class,'SchoolData']);
Route::delete('/DeleteSchool/{id}', [SchoolController::class, 'deleteSchooldata']);

Route::get('/search', [StudentController::class, 'search']);
Route::get('/searchproviders', [ProviderController::class, 'searchProvider']);
Route::get('/searchschool', [SchoolController::class, 'SearchSchool']);
Route::post('/EditStudent/{id}', [StudentController::class,'editstudent']);
Route::get('/FetchSchoolDataBYID/{id}',[SchoolController::class,'FetchSchoolDataBYID']);
Route::get('/FetchUserDetails',[AuthController::class,'fetchUser']);
Route::post('/AddSingleSessions', [CalendarController::class,'AddSingleSessions']);
Route::get('/SingleSession/{id}/{roll_name}',[CalendarController::class,'FetchSingleSession']);
Route::post('/AddBulkSession',[CalendarController::class,'AddBulkSession']);
Route::get('/BulkSessionDetails',[CalendarController::class,'FetchBulkSessionDetails']);

Route::delete('/DeleteSession', [CalendarController::class, 'deleteSession']);
Route::middleware('auth:sanctum')->get('/roll_id', [AuthController::class, 'getRollId']);
Route::post('/ConfirmSession', [CalendarController::class, 'CalendarConfirmSession']);
// Route::post('/ConfirmSession', [CalendarController::class, 'CalendarConfirmSession']);
Route::get('/FetchConfirmSession',[CalendarController::class,'FetchConfirmessionDetails']);

// Route::get('/StudentServicesDataFetchAsID/{id}', [StudentController::class, 'StudentServicesDataFetchAsID']);
Route::post('/upload_iep_doc', [StudentController::class, 'uploadIEP']);
Route::get('/get_iep/{id}', [StudentController::class, 'getUploadedIEP']);
Route::delete('/delete_iep_upload_file/{filename}', [StudentController::class, 'deleteIEP']);

Route::delete('/DeleteStudentService/{id}', [StudentController::class, 'DeleteStudentService']);

Route::post('/UpdateSingleSession', [CalendarController::class, 'UpdateSingleSession']);
Route::delete('/DeleteFutureSession', [CalendarController::class, 'DeleteFutureSession']);
Route::get('/AssignProviderMinMaxDate/{id}', [CalendarController::class, 'AssignProviderMinMaxDate']);
