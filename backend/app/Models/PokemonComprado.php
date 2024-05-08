<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PokemonComprado extends Model
{
    use HasFactory;

    protected $table = 'pokemons_comprados';
    
    protected $fillable = [
        'compra_id',
        'pokemon_name',
        'sprite',
        'price',
    ];

    public function compra()
    {
        return $this->belongsTo(Compra::class);
    }
}

