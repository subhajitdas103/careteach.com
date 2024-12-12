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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('grade');
            $table->string('school_name');
            $table->string('home_address')->nullable();
            $table->decimal('doe_rate', 8, 2)->nullable();
            $table->string('iep_doc')->nullable();
            $table->string('disability')->nullable();
            $table->string('nyc_id')->nullable();
            $table->decimal('notesPerHour', 8, 2)->nullable();
            $table->string('case_v')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
