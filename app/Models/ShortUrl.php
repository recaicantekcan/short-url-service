<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShortUrl extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'store_id',
        "url_id",
        'url_type',
        'code',
        'clicked',
    ];

    protected $visible = [
        'store_id',
        "url_id",
        'url_type',
        'code',
        'clicked',
    ];
}
