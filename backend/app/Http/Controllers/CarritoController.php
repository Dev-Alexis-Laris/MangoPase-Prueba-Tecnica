<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Carrito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CarritoController extends Controller
{

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


    public function eliminarDelCarrito($nombre)
    {
        $user = Auth::user();

        $carrito = Carrito::where('pokemon_name', $nombre)
            ->where('user_id', $user->id)
            ->first();

        if ($carrito) {
            $carrito->delete();

            return response()->json(['message' => 'Pokémon eliminado del carrito']);
        } else {
            return response()->json(['message' => 'Pokémon no encontrado en el carrito'], 404);
        }
    }

    public function vaciarCarrito()
    {
        $user = Auth::user();
        Carrito::where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Carrito vaciado']);
    }



}
