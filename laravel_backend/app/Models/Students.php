<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
    //
    protected $table = 'students';



    // Define fillable attributes for mass assignment
    // protected $fillable = [
    //     'first_name', 'last_name', 'grade', 'school_name', 'home_address',
    //     'doe_rate', 'iep_doc', 'disability', 'nyc_id', 'notesPerHour', 'case_v'
    // ];
   
        protected $fillable = [
            'first_name', 'last_name', 'grade', 'school_name', 'home_address',
            'doe_rate', 'iep_doc', 'disability', 'nyc_id', 'notes_per_hour', 'case' ,'resulation_invoice','status'
        ];
    
    

}
