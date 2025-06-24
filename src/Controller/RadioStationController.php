<?php

namespace App\Controller;

use App\Repository\RadioStationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class RadioStationController extends AbstractController
{
    #[Route('/api/radios', name: 'api_radios', methods: ['GET'])]
    public function getRadios(Request $request, RadioStationRepository $repository): JsonResponse
    {
        $country = $request->query->get('country');

        if (!$country) {
            return $this->json(['error' => 'Missing country parameter'], 400);
        }

        $radios = $repository->findBy([
            'country' => $country,
            'isActive' => true
        ]);

        $result = array_map(fn($radio) => [
            'id' => $radio->getId(),
            'name' => $radio->getName(),
            'url' => $radio->getStreamUrl(),
            'lat' => $radio->getLatitude(),
            'lng' => $radio->getLongitude()
        ], $radios);

        return $this->json($result);
    }
}
