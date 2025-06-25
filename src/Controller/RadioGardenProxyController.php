<?php

namespace App\Controller;


use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RadioGardenProxyController extends AbstractController
{
    #[Route('/api/radiogarden/places', name: 'radiogarden_places')]
    public function places(): JsonResponse
    {
        $client = HttpClient::create();
        $response = $client->request('GET', 'https://radio.garden/api/ara/content/places');
        $content = $response->getContent();

        return new JsonResponse(json_decode($content, true));
    }

    #[Route('/api/radiogarden/page/{id}', name: 'radiogarden_page')]
    public function page(string $id): JsonResponse
    {
        $client = HttpClient::create();
        $response = $client->request('GET', "https://radio.garden/api/ara/content/page/$id");
        $content = $response->getContent();

        return new JsonResponse(json_decode($content, true));
    }
}
