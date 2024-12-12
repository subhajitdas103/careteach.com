<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $credentials = $request->only('email', 'password');
// dd($credentials);
    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        $token = $user->createToken('AuthToken')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    return response()->json([
        'status' => 'error',
        'message' => 'Invalid credentials'
    ], 401);
}
}
