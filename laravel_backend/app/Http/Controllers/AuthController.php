<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User; 
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $roll_id = $user->roll_id; 
            $roll_name = $user->roll_name;
            $token = $user->createToken('AuthToken', ['roll_id' => $roll_id]);
            $tokenString = $token->plainTextToken; // For Sanctum
           
            return response()->json([
                'status' => 'success',
                'token' => $tokenString,
                'roll_id' => $roll_id,
                'roll_name' => $roll_name,
                'user' => $user,
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Invalid credentials'
        ], 401);
    }
    

    public function getRollId(Request $request)
    {
        // Check if the user is authenticated
        if (Auth::check()) {
            // Fetch the authenticated user
            $user = Auth::user();
            
            // Return the roll_id of the authenticated user
            return response()->json([
                'roll_id' => $user->roll_id,
                'roll_name' => $user->roll_name,
            ], 200);
        }

        // If the user is not authenticated
        return response()->json([
            'message' => 'Not authenticated',
        ], 401);
    }



}
