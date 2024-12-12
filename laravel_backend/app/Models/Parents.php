<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parents extends Model
{
    //
    protected $table = 'parents';



    // Define fillable attributes for mass assignment
    // protected $fillable = [
    //     'first_name', 'last_name', 'grade', 'school_name', 'home_address',
    //     'doe_rate', 'iep_doc', 'disability', 'nyc_id', 'notesPerHour', 'case_v'
    // ];
   
        protected $fillable = [
            'parent_name' , 'parent_email' ,'parent_type', 'ph_no'
        ];
    
    

}
