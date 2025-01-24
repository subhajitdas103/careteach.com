<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfirmSession extends Model
{
    protected $table = 'confirm_session';
    protected $fillable = [ 
        'student_id', 
        'provider_id',
        'session_type',
        'date',
        'start_time',
        'end_time',
        
            ];
}
