<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Providers extends Model
{
    //
    protected $table = 'providers';

    
       
    
        protected $fillable = ['provider_first_name', 'provider_last_name','provider_dob','provider_email','provider_phone','provider_address','rate','rate_notes','form','company_name','grades_approved','license_exp_date_applicable','license_exp_date','pets_status','pets_approval_date','bilingual','ss_number','notes','status'];

/**
     * Dynamically set the table name for the model.
     *
     * @param string $tableName
     */
   


    public function setDynamicTable($tableName, $fillableColumns)
    {
        $this->table = $tableName;
        $this->fillable = $fillableColumns;
    }
}
