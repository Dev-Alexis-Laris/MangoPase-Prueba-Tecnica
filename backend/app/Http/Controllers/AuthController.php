<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);


        return response()->json(['user' => $user], 201);
    }

    public function login(Request $request)
    {
        
        Log::debug('Credenciales recibidas:', ['email' => $request->input('email')]);
        $credentials = $request->only('email', 'password');

        
        try {
            $token = JWTAuth::attempt($credentials);

            if (!$token) {
                Log::warning('Token inválido para el usuario:', ['email' => $request->input('email')]);
                return response()->json(['error' => 'Token Inválido!'], 401);
            }

            Log::debug('Token generado:', ['token' => $token]);
            return response()->json(['token' => $token]);
        } catch (\Exception $e) {

            Log::error('Error en el inicio de sesión:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error interno del servidor', 'message' => $e->getMessage()], 500);
        }
    }

    public function userInfo()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
        
        return response()->json(['name' => $user->name], 200);
    }


}
