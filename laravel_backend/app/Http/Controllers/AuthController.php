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

        // Create token and include roll_id in the token payload
        // $token = $user->createToken('AuthToken', ['roll_id' => $user->roll_id])->plainTextToken;
        $token = $user->createToken('AuthToken', ['roll_id' => $user->roll_id]);
        $tokenString = $token->plainTextToken; // For Sanctum
        // or
        $tokenString = $token->accessToken; // For Passport
        
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


public function fetchUser(Request $request){
    try {
        $user = Auth::user(); // Get the authenticated user

        if ($user) {
            // Extract roll_id from the user's token payload
            $roll_id = $user->token()->abilities['roll_id']; // Fetch roll_id from token's abilities

            return response()->json([
                'user' => $user,
                'roll_id' => $roll_id, // Return the roll_id along with user details
            ]);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    } catch (\Exception $e) {
        \Log::error('Error fetching user: ' . $e->getMessage());
        return response()->json(['error' => 'Error fetching user'], 500);
    }
}


}
