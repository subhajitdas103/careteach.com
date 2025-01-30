<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login the user and generate an API token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Username is incorrect',
            ], 401);
        }
        if (Hash::check($request->password, $user->password)) {
            $token = $user->createToken('AuthToken')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                ],
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Password is incorrect',
            ], 401);
        }
    }

    /**
     * Get the roll_id of the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRollId(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json([
                'roll_id' => $user->roll_id,
                'roll_name' => $user->roll_name,
            ], 200);
        }

        return response()->json([
            'message' => 'Not authenticated',
        ], 401);
    }

    /**
     * Handle user registration.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    // public function register(Request $request)
    // {
    //     // Validate the input data
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email|unique:users,email',
    //         'password' => 'required|min:8|confirmed',
    //     ]);

    //     if ($validator->fails()) {
    //         throw ValidationException::withMessages($validator->errors()->toArray());
    //     }

    //     // Create a new user
    //     $user = User::create([
    //         'email' => $request->email,
    //         'password' => Hash::make($request->password),
    //         'roll_id' => $request->roll_id,
    //         'roll_name' => $request->roll_name,
    //     ]);

    //     // Generate an API token for the new user
    //     $token = $user->createToken('AuthToken')->plainTextToken;

    //     return response()->json([
    //         'status' => 'success',
    //         'token' => $token,
    //         'user' => $user,
    //     ], 201);
    // }
}
