<?php

namespace App\Http\Controllers;

use App\Classes\Services\ShortUrlService;
use App\Models\ShortUrl;
use Illuminate\Http\Request;

class ShortUrlController extends Controller
{
    public function index(Request $request, $code) 
    {
        $main_long_url = "https://domain.com/"; $url_detail = "";

        $accept_language = $request->header('Accept-Language');
        
        $short_code = ShortUrl::where('code', $code)->select('store_id', 'url_id','url_type')->first();

        if($short_code)
        {
            $value = [
                'store_id'  => $short_code->store_id,
                'id'        => $short_code->url_id,
                'url_type'  => $short_code->url_type,
            ];

            $api_short_url_controller = new ShortUrlService();
            $result = $api_short_url_controller->getLongUrl($value,$accept_language);

            if($result['statusCode'] == 200)
            {
                if(isset($result['value']) && count($result['value']) > 0)
                {
                    if(isset($result['value']['long_url']) && !empty($result['value']['long_url']))
                    {
                        $url_detail = $result['value']['long_url'];
                    }
                }
            }
        }

        return redirect($main_long_url.$url_detail);

    }
}
