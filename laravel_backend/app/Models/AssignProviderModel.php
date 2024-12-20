<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignProviderModel extends Model
{
    protected $table = 'assign_provider';
    protected $primaryKey = 'id';
    protected $fillable = [ 
         
    'provider_name',
    'provider_rate',
    'location',
    'service_type',
    'wkly_hours',
    'yearly_hours',
    'start_date',
    'end_date',
    'student_id',
        ];

     
}
