<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\CompraController;

Route::middleware('jwt.verify')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::get('/userInfo', [AuthController::class, 'userInfo']);

Route::post('/comprar', [CompraController::class, 'realizarCompra']);

Route::get('/compras', [CompraController::class, 'verComprasAnteriores']);

Route::post('/carrito/agregar', [CarritoController::class, 'agregarAlCarrito']);

Route::delete('/carrito/eliminar/{id}', [CarritoController::class, 'eliminarDelCarrito']);

Route::middleware('jwt.verify')->group(function () {
    Route::delete('/carrito/vaciar', [CarritoController::class, 'vaciarCarrito']);
});







