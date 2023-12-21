<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

use App\Models\ShortUrl;

use Exception;

class ShortUrlApiController extends Controller
{
    public function shortUrl(Request $request) 
    {
        $content = json_decode($request->getContent(), true);

        $store_id   = $content['store_id'];
        $url_id     = $content['id'];
        $url_type   = $content['url_type'];

        $rules = [
            'store_id'  => 'required',
            'id'        => 'required',
            'url_type'  => 'required',
        ];

        $messages = [
            'required'  => 'The :attribute field is required to be sent!',
        ];

        $attributes = [
            'store_id'  => 'Store ID',
            'id'        => 'ID',
            'url_type'  => 'URL Type',
        ];

        $validator=Validator::make($content,$rules,$messages,$attributes);

        if ($validator->fails())
        {
            return response(['result' => 100, 'response' => 'error', 'message' => $validator->errors()->first()]);
        }

        $value = ['store_id' => $store_id, 'url_type' => $url_type, 'url_id' => $url_id];


        try {
            $short_url_query = ShortUrl::where('store_id', $store_id)
                ->where('url_id', $url_id)
                ->where('url_type', $url_type)
                ->first();

            if(!$short_url_query)
            {
                $clicked = 0;
                $code = $this->generateUniqueCode();

                ShortUrl::create([
                    'store_id'  => $store_id,
                    'url_id'    => $url_id,
                    'url_type'  => $url_type,
                    'code'      => $code,
                ]);

                $message = "The short URL has been created successfully.";
            }else
            {
                $code = $short_url_query->code;
                $clicked = $short_url_query->clicked;
                $message = "The short URL has been fetched successfully.";  
            }

            $value['code'] = $code;
            $value['clicked'] = $clicked;
            
            $result = 200; 
            $response = "success";
            
        } catch (Exception $e) {
     
            $result = 100; 
            $response = "Error"; 
            $message = "An error occurred while creating the short URL.";  
        }

        return response(['result' => $result, 'response' => $response, 'message' => $message, 'value' => $value]);
    }
    public function deleteSortUrl(Request $request)
    {
        $content = json_decode($request->getContent(), true);

        $store_id   = $content['store_id'];
        $url_id     = $content['id'];
        $url_type   = $content['url_type'];

        $rules = [
            'store_id'  => 'required',
            'id'        => 'required',
            'url_type'  => 'required',
        ];

        $messages = [
            'required'  => 'The :attribute field is required to be sent!',
        ];

        $attributes = [
            'store_id'  => 'Store ID',
            'id'        => 'ID',
            'url_type'  => 'URL Type',
        ];

        $validator=Validator::make($content,$rules,$messages,$attributes);

        if ($validator->fails())
        {
            return response(['result' => 100, 'response' => 'error', 'message' => $validator->errors()->first()]);
        }

        $value = ['store_id' => $store_id, 'url_type' => $url_type, 'url' => $url_id];

        try {

            $result = 100; 
            $response = "error";
            $message = "No URL matching the submitted information was found.";  

            $short_url_query = ShortUrl::where('store_id', $store_id)
                ->where('url_id', $url_id)
                ->where('url_type', $url_type)
                ->first();

            if($short_url_query)
            {
                $short_url_query->delete();

                $message = "The deletion completed successfully.";

                $result = 200; 
                $response = "success";
            }

        } catch (Exception $e) {
     
            $result = 100; 
            $response = "Error"; 
            $message = "An error occurred during the deletion process.";  
        }

        return response(['result' => $result, 'response' => $response, 'message' => $message, 'value' => $value]);
    }
    public function shortUrlDetails(Request $request) 
    {
        $content = json_decode($request->getContent(), true);

        $store_id   = $content['store_id'];
        $url_type   = $content['url_type']; // If null is sent, it returns all types

        $rules = [
            'store_id'  => 'required',
        ];
        $messages = [
            'required'  => 'The :attribute field is required to be sent!',
        ];
        $attributes = [
            'store_id'  => 'Store ID',
        ];

        $validator=Validator::make($content,$rules,$messages,$attributes);

        if ($validator->fails())
        {
            return response(['result' => 100, 'response' => 'error', 'message' => $validator->errors()->first()]);
        }

        $values['store_id'] = $store_id;

        try {
            $short_url_queries = ShortUrl::where('store_id', $store_id);

            if(!empty($url_type)){$short_url_queries = $short_url_queries->where('url_type', $url_type);}
                
            $values['short_urls'] = $short_url_queries->select('url_type', 'url_id', 'code', 'clicked')
                ->get()->toArray();

            $result = 200; 
            $response = "success";
            $message = "The short URLS has been fetched successfully.";
            
        } catch (Exception $e) {
     
            $result = 100; 
            $response = "Error"; 
            $message = "Talep başarıyla alındı en kısa sürede sms ve mail ile bilgilendirileceksiniz.";  
        }

        return response(['result' => $result, 'response' => $response, 'message' => $message, 'value' => $values]);
    }


    //HELPER FUNCTION 
    public function generateUniqueCode()
    {
        //Switches to 6 characters
        /*if (ShortUrl::count() >= 5 * pow(36, 5)) {$code = Str::random(6);}*/

        $code = Str::random(5);
        while (ShortUrl::where('code', $code)->exists()) {$code = $this->incrementCode($code);}
        return $code;
    }
    private function incrementCode($code)
    {
        $lastChar = substr($code, -1);
        $nextChar = ++$lastChar;

        if ($nextChar == '{') {
            $code = $this->incrementCode(substr($code, 0, -1)) . 'a';
        } else {
            $code = substr_replace($code, $nextChar, -1);
        }

        return $code;
    }
}
