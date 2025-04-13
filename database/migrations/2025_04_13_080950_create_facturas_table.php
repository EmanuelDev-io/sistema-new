<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('facturas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('ruta_archivo');
            $table->decimal('monto', 10, 2);
            $table->date('fecha_emision');
            $table->date('fecha_vencimiento')->nullable();
            $table->enum('tipo_documento', ['imagen', 'pdf', 'otro'])->default('otro');
            $table->unsignedBigInteger('gasto_id')->nullable();
            $table->foreign('gasto_id')->references('id')->on('gastos')->onDelete('cascade');
            $table->text('notas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
