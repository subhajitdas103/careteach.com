<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentServices extends Model
{
    //
    protected $table = 'student_services';



        protected $fillable = [
            'service_type' , 'start_date' ,'end_date', 'weekly_mandate' ,'yearly_mandate' ,'student_id'
        ];
    
    

}
