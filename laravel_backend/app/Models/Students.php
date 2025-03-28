<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
    //
    protected $table = 'students';

   
        protected $fillable = [
            'first_name', 'school_id','last_name', 'grade', 'school_name', 'home_address',
            'doe_rate', 'iep_doc', 'disability', 'nyc_id', 'notes_per_hour', 'case' ,'resulation_invoice','status' , 'parent_id' , 'roll_id'
        ];
    
 

}
