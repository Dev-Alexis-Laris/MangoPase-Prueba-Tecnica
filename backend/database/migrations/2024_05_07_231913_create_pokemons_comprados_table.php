<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePokemonsCompradosTable extends Migration
{
    public function up()
    {
        Schema::create('pokemons_comprados', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('compra_id');
            $table->string('pokemon_name');
            $table->string('sprite');
            $table->decimal('price', 8, 2);
            $table->timestamps();

            // Llave foránea para relacionarse con la tabla compras
            $table->foreign('compra_id')->references('id')->on('compras')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pokemons_comprados');
    }
}
