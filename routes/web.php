<?php

use App\Http\Controllers\ShortUrlController;
use Illuminate\Support\Facades\Route;


Route::get('/{code}',[ShortUrlController::class,'index']);

