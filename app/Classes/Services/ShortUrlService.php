<?php

namespace App\Classes\Services;

use GuzzleHttp\Client;

class ShortUrlService
{
    static private $base_url        = "https://domain.com/api/v1/";
    static private $grant_type      = 'client_credentials';
    static private $client_id       = '1';
    static private $client_secret   = 'gS237MxpyFwNxdWowEPGsdN9WrhG1IuZgM8b545xk7JPMs82';


    static private $access_token = null;

    public function __construct()
    {
        $response = $this->login();

        if ($response["statusCode"] == 200) {
            self::$access_token = $response['access_token'];
        }else
        {
            return ["statusCode" => 3];
        }
    }

    public function login()
    {
        $client = new Client();
        $result = $client->post( self::$base_url . 'token', [
            'http_errors' => false,
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'body' => "{
                \r\n    \"grant_type\" : \"".self::$grant_type ."\",\r\n    \"client_id\" : \"".self::$client_id."\",\r\n    \"client_secret\" : \"".self::$client_secret."\"\r\n}"
        ]);
        $response = json_decode($result->getBody()->getContents(), true);

        $response["statusCode"] = $result->getStatusCode();

        return $response;
    }

    static private function send($endpoint, $method, $params = null, $accept_language)
    {
        $client = new Client();
        $options = [
            'http_errors' => false,
            'headers' => [
                'Authorization'     => 'Bearer ' . self::$access_token,
                'Content-Type'      => 'application/json',
                'Accept-Language'   => $accept_language,
            ]
        ];

        if($params != null)
        {
            $options['body'] = json_encode($params);
        }
        
        $result = $client->request($method, self::$base_url  . $endpoint, $options);
        
        $statusCode = $result->getStatusCode();

        $result = json_decode($result->getBody()->getContents(), true);

        $result["statusCode"] = $statusCode;
        if ($statusCode == 200)
        {
            $result["status"] = "success";
        }else
        {
            $result["status"] = "failure";
        }

        return $result;
    }

    public function getLongUrl($params,$accept_language)
    {
        return $this->send('url/get-long-url','POST',$params, $accept_language);
    }
}
