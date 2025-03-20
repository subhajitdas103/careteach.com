<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HolidayModel extends Model
{
    protected $table = 'holiday';
    
    protected $fillable = [
        'name', 
        'start_date', 
        'end_date'
    ];


}