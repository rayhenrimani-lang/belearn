<?php

namespace App\Controller;

use App\service\OpenAIService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class QuizController
{
    #[Route('/generate-quiz', methods: ['POST'])]
    public function generate(Request $request, OpenAIService $service): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // check بسيط باش ما يطيحش error
        if (!isset($data['theme'], $data['topic'], $data['level'])) {
            return new JsonResponse([
                'error' => 'Missing parameters'
            ], 400);
        }

        $result = $service->generateQuiz(
            $data['theme'],
            $data['topic'],
            $data['level']
        );

        return new JsonResponse($result);
    }
}