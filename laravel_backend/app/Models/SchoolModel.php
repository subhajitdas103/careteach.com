<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolModel extends Model
{
    protected $table = 'school';
    protected $fillable = [
        'school_name', 
        'principal_name', 
        'address', 
        'phone', 
        'working_days', 
        'holiday', 
        'email',
        'status'
    ];


}
