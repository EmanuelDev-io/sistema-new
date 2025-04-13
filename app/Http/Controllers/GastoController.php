<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GastoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $gastos = Gasto::orderBy('fecha', 'desc')->get();
        return response()->json($gastos);
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

        $gasto = Gasto::create($request->all());
        return response()->json($gasto, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Gasto $gasto): JsonResponse
    {
        return response()->json($gasto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gasto $gasto): JsonResponse
    {
        $request->validate([
            'descripcion' => 'sometimes|required|string|max:255',
            'monto' => 'sometimes|required|numeric|min:0',
            'fecha' => 'sometimes|required|date',
            'categoria' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
        ]);

        $gasto->update($request->all());
        return response()->json($gasto);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gasto $gasto): JsonResponse
    {
        $gasto->delete();
        return response()->json(null, 204);
    }

    /**
     * Get all facturas associated with this gasto.
     */
    public function facturas(Gasto $gasto): JsonResponse
    {
        return response()->json($gasto->facturas);
    }
}