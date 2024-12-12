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

Route::post('/addstudent', [StudentController::class,'addstudent']);
Route::post('/addprovider', [ProviderController::class,'addprovider']);

// Route::match(['get', 'post'], '/addstudent', [StudentController::class, 'addstudent']);
