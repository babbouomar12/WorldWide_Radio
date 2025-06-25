<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class RadioProxyController extends AbstractController
{
    /**
     * @Route("/api/radio-proxy", name="radio_proxy")
     */
    public function proxy(Request $request)
    {
        $url = $request->query->get('url');

        if (!$url) {
            return new JsonResponse(['error' => 'URL parameter is required'], 400);
        }

        try {
            $client = HttpClient::create();
            $response = $client->request('GET', $url);

            return new JsonResponse($response->toArray());
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Proxy request failed'], 502);
        }
    }
}
