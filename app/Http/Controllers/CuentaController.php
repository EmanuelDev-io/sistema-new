<?php

namespace App\Http\Controllers;

use App\Models\Cuenta;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CuentaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $cuentas = Cuenta::orderBy('nombre_pagina')->get();
        return response()->json($cuentas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombre_pagina' => 'required|string|max:255',
            'correo' => 'required|string|max:255',
            'password' => 'required|string|max:255',
            'fecha_registro' => 'required|date',
            'fecha_vencimiento' => 'nullable|date',
            'tipo_servicio' => 'nullable|string|in:outlook,hostinger,otro',
            'notas' => 'nullable|string',
        ]);

        $cuenta = Cuenta::create($request->all());
        return response()->json($cuenta, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cuenta $cuenta): JsonResponse
    {
        return response()->json($cuenta);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cuenta $cuenta): JsonResponse
    {
        $request->validate([
            'nombre_pagina' => 'sometimes|required|string|max:255',
            'correo' => 'sometimes|required|string|max:255',
            'password' => 'sometimes|required|string|max:255',
            'fecha_registro' => 'sometimes|required|date',
            'fecha_vencimiento' => 'nullable|date',
            'tipo_servicio' => 'nullable|string|in:outlook,hostinger,otro',
            'notas' => 'nullable|string',
        ]);

        $cuenta->update($request->all());
        return response()->json($cuenta);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cuenta $cuenta): JsonResponse
    {
        $cuenta->delete();
        return response()->json(null, 204);
    }
}