<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class FacturaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $facturas = Factura::orderBy('fecha_emision', 'desc')->get();
        return response()->json($facturas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'archivo' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'monto' => 'required|numeric|min:0',
            'fecha_emision' => 'required|date',
            'fecha_vencimiento' => 'nullable|date',
            'tipo_documento' => 'required|in:imagen,pdf,otro',
            'gasto_id' => 'nullable|exists:gastos,id',
            'notas' => 'nullable|string',
        ]);

        // Guardar el archivo
        $path = $request->file('archivo')->store('facturas', 'public');
        
        $factura = new Factura([
            'nombre' => $request->nombre,
            'ruta_archivo' => $path,
            'monto' => $request->monto,
            'fecha_emision' => $request->fecha_emision,
            'fecha_vencimiento' => $request->fecha_vencimiento,
            'tipo_documento' => $request->tipo_documento,
            'gasto_id' => $request->gasto_id,
            'notas' => $request->notas,
        ]);
        
        $factura->save();
        
        return response()->json($factura, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Factura $factura): JsonResponse
    {
        return response()->json($factura);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Factura $factura): JsonResponse
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'archivo' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'monto' => 'sometimes|required|numeric|min:0',
            'fecha_emision' => 'sometimes|required|date',
            'fecha_vencimiento' => 'nullable|date',
            'tipo_documento' => 'sometimes|required|in:imagen,pdf,otro',
            'gasto_id' => 'nullable|exists:gastos,id',
            'notas' => 'nullable|string',
        ]);

        // Si se proporciona un nuevo archivo, eliminar el anterior y guardar el nuevo
        if ($request->hasFile('archivo')) {
            // Eliminar el archivo anterior
            Storage::disk('public')->delete($factura->ruta_archivo);
            
            // Guardar el nuevo archivo
            $path = $request->file('archivo')->store('facturas', 'public');
            $factura->ruta_archivo = $path;
        }
        
        // Actualizar los demás campos
        $factura->fill($request->except('archivo'));
        $factura->save();
        
        return response()->json($factura);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Factura $factura): JsonResponse
    {
        // Eliminar el archivo asociado
        Storage::disk('public')->delete($factura->ruta_archivo);
        
        // Eliminar el registro
        $factura->delete();
        
        return response()->json(null, 204);
    }
}