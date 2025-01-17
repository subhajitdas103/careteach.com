<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulkSessionModel extends Model
{
    protected $table = 'bulk_session';
    protected $fillable = [ 
        'student_id', 
        'student_name',
        'session_name',
        'dayofweek',
        'start_date',
        'end_date' , 
        'start_time',
        'end_time',
        'session_dates',
            ];
}
