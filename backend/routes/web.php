<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\CompraController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::get('/userInfo', [AuthController::class, 'userInfo']);

Route::middleware('jwt.verify')->group(function () {
    Route::post('/carrito/agregar', [CarritoController::class, 'agregarAlCarrito']);
    Route::delete('/carrito/eliminar/{id}', [CarritoController::class, 'eliminarDelCarrito']);
    Route::delete('/carrito/vaciar', [CarritoController::class, 'vaciarCarrito']);

    // Ruta para realizar una compra
    
    // Ruta para ver compras anteriores
    Route::get('/compras', [CompraController::class, 'verComprasAnteriores']);
});
Route::post('/comprar', [CompraController::class, 'realizarCompra'])->name("comprar");

Route::get('/', function () {
    return view('welcome');
});
