<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class RadioController extends AbstractController
{
    #[Route('/', name: 'app_radio')]
    public function index(): Response
    {
        return $this->render('radio/index.html.twig');
    }
    #[Route('/api/proxy/stations', name: 'api_proxy_stations')]
    public function proxyStations(): JsonResponse
    {
        $client = HttpClient::create();
        $response = $client->request('GET', 'https://api.radio-browser.info/json/stations/topclick/100');
        $content = $response->getContent();
        $data = json_decode($content, true);

        return new JsonResponse($data);
    }

}
