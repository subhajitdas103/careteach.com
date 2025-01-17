<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalendarModel extends Model
{
    protected $table = 'single_session';
    protected $fillable = [ 
        'student_id', 
        'student_name',
        'session_name',
        'date',
        'start_time',
        'end_time',
        
            ];
}
