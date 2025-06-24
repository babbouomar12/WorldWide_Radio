<?php
// src/Command/ImportRadioStationsCommand.php

namespace App\Command;

use App\Entity\RadioStation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(
    name: 'app:import-radio-stations',
    description: 'Importe toutes les stations radio depuis radio-browser.info',
)]
class ImportRadioStationsCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private HttpClientInterface $httpClient
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('📡 Téléchargement des stations radio en cours...');

        $response = $this->httpClient->request(
            'GET',
            'https://de1.api.radio-browser.info/json/stations'
        );

        $stations = $response->toArray();
        $count = 0;

        foreach ($stations as $data) {
            // Filtre basique : éviter les stations sans flux valide
            if (empty($data['url']) || !filter_var($data['url'], FILTER_VALIDATE_URL)) {
                continue;
            }

            $station = new RadioStation();
            $station->setName($data['name'] ?? 'Unknown');
            $station->setCountry($data['country'] ?? 'Unknown');
            $station->setStreamUrl($data['url']);
            $station->setLatitude((float)($data['latitude'] ?? 0));
            $station->setLongitude((float)($data['longitude'] ?? 0));
            $station->setIsActive(true);

            $this->em->persist($station);
            $count++;

            // flush par lot de 100 pour économiser de la mémoire
            if ($count % 100 === 0) {
                $this->em->flush();
                $this->em->clear();
            }
        }

        // Flush final
        $this->em->flush();

        $output->writeln("✅ Import terminé : {$count} stations ajoutées.");

        return Command::SUCCESS;
    }
}
