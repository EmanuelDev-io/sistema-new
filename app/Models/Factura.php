<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Factura extends Model
{
    use HasFactory;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'facturas';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'nombre',
        'ruta_archivo',
        'monto',
        'fecha_emision',
        'fecha_vencimiento',
        'tipo_documento',
        'gasto_id',
        'notas',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha_emision' => 'date',
            'fecha_vencimiento' => 'date',
            'monto' => 'decimal:2',
        ];
    }
    
    /**
     * Get the gasto that owns the factura.
     */
    public function gasto(): BelongsTo
    {
        return $this->belongsTo(Gasto::class);
    }
}