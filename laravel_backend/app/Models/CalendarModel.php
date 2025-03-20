<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalendarModel extends Model
{
    protected $table = 'single_session';
    protected $fillable = [ 
        'student_id', 
        'user_roll_id',
       
        'student_name',
        'session_name',
        'date',
        'start_time',
        'end_time',
        
            ];


 public function assignProvider()
{
    return $this->belongsTo(AssignProviderModel::class, 'provider_id', 'id');
}

}
