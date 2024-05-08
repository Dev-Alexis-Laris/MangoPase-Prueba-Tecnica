<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Carrito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CarritoController extends Controller
{
    // Agregar un Pokémon al carrito
    public function agregarAlCarrito(Request $request)
    {
        $request->validate([
            'pokemon_name' => 'required|string',
            'sprite' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $user = Auth::user();

        $carrito = new Carrito([
            'user_id' => $user->id,
            'pokemon_name' => $request->pokemon_name,
            'sprite' => $request->sprite,
            'price' => $request->price,
        ]);

        $carrito->save();

        return response()->json(['message' => 'Pokémon agregado al carrito'], 201);
    }

    // Eliminar un Pokémon del carrito
    public function eliminarDelCarrito($nombre)
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Buscar el Pokémon en el carrito del usuario por su nombre
        $carrito = Carrito::where('pokemon_name', $nombre)
            ->where('user_id', $user->id)
            ->first();

        // Verificar si el Pokémon existe en el carrito
        if ($carrito) {
            // Eliminar el Pokémon del carrito
            $carrito->delete();

            // Responder con un mensaje de éxito
            return response()->json(['message' => 'Pokémon eliminado del carrito']);
        } else {
            // Responder con un mensaje de error si el Pokémon no se encontró
            return response()->json(['message' => 'Pokémon no encontrado en el carrito'], 404);
        }
    }



    // Vaciar el carrito
    public function vaciarCarrito()
    {
        $user = Auth::user();
        Carrito::where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Carrito vaciado']);
    }

    public function obtenerCarrito()
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Buscar todos los elementos en el carrito del usuario
        $carrito = Carrito::where('user_id', $user->id)->get();

        // Responder con los elementos del carrito del usuario
        return response()->json($carrito);
    }

}
