<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\FacturaController;

Route::get('/', function () {
    return view('welcome');
});

// Rutas para Ingresos
Route::prefix('api')->group(function () {
    Route::apiResource('ingresos', IngresoController::class);
    Route::apiResource('gastos', GastoController::class);
    Route::get('gastos/{gasto}/facturas', [GastoController::class, 'facturas']);
    Route::apiResource('cuentas', CuentaController::class);
    Route::apiResource('facturas', FacturaController::class);
});
