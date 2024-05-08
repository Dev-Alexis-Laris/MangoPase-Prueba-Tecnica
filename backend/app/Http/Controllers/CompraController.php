<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Carrito;
use App\Models\PokemonComprado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class CompraController extends Controller
{
    
    public function realizarCompra(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $carritoItems = $request->json()->all(); 

        if (empty($carritoItems)) {
            return response()->json(['message' => 'Carrito vacío'], 400);
        }

        
        $total = array_sum(array_column($carritoItems, 'price'));

        
        $compra = new Compra([
            'user_id' => $user->id,
            'total' => $total,
        ]);
        $compra->save();

        
        foreach ($carritoItems as $item) {
            
            if (!isset($item['pokemon_name']) || !isset($item['sprite']) || !isset($item['price'])) {
                return response()->json(['message' => 'Datos del carrito incompletos o incorrectos'], 400);
            }

            
            $pokemonComprado = new PokemonComprado([
                'compra_id' => $compra->id,
                'pokemon_name' => $item['pokemon_name'],
                'sprite' => $item['sprite'],
                'price' => $item['price'],
            ]);
            $pokemonComprado->save();
        }

        
        return response()->json(['message' => 'Compra realizada con éxito', 'compra' => $compra], 200);
    }

    public function verComprasAnteriores()
    {
        $user = Auth::user();
        $compras = Compra::where('user_id', $user->id)->with('pokemonsComprados')->get();

        return response()->json(['compras' => $compras]);
    }
}
