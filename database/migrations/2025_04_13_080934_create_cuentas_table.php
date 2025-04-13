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
        Schema::create('cuentas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_pagina');
            $table->string('correo');
            $table->string('password');
            $table->date('fecha_registro');
            $table->date('fecha_vencimiento')->nullable();
            $table->enum('tipo_servicio', ['outlook', 'hostinger', 'otro'])->default('otro');
            $table->text('notas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuentas');
    }
};
