<?php

namespace App\service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class OpenAIService
{
    private $client;
    private $apiKey;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
        $this->apiKey = $_ENV['OPENAI_API_KEY'];
    }

    public function generateQuiz($theme, $topic, $level)
    {
        $prompt = "You are a quiz generator.

Theme: $theme
Topic: $topic
Level: $level

Generate 1 multiple choice question with:
- 4 choices
- 1 correct answer
- short explanation

Return ONLY JSON like:
{
  \"question\": \"\",
  \"choices\": [],
  \"answer\": \"\",
  \"explanation\": \"\"
}";

        $response = $this->client->request('POST', 'https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
            ],
        ]);

        $data = $response->toArray();

        $content = $data['choices'][0]['message']['content'] ?? null;

        if (!$content) {
            return ['error' => 'No response from AI'];
        }

        $decoded = json_decode($content, true);

        if (!$decoded) {
            return ['error' => 'Invalid JSON', 'raw' => $content];
        }

        return $decoded;
    }
}