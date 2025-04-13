<?php

namespace App\Http\Controllers;

use App\Models\Ingreso;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class IngresoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $ingresos = Ingreso::orderBy('fecha', 'desc')->get();
        return response()->json($ingresos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'descripcion' => 'required|string|max:255',
            'monto' => 'required|numeric|min:0',
            'fecha' => 'required|date',
            'categoria' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
        ]);

        $ingreso = Ingreso::create($request->all());
        return response()->json($ingreso, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ingreso $ingreso): JsonResponse
    {
        return response()->json($ingreso);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ingreso $ingreso): JsonResponse
    {
        $request->validate([
            'descripcion' => 'sometimes|required|string|max:255',
            'monto' => 'sometimes|required|numeric|min:0',
            'fecha' => 'sometimes|required|date',
            'categoria' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
        ]);

        $ingreso->update($request->all());
        return response()->json($ingreso);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ingreso $ingreso): JsonResponse
    {
        $ingreso->delete();
        return response()->json(null, 204);
    }
}