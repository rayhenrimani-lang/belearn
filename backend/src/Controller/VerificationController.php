<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

#[Route('/api')]
class VerificationController extends AbstractController
{
    private $cache;
    private $verificationCodes = [];

    public function __construct(private MailerInterface $mailer)
    {
        $this->cache = new FilesystemAdapter();
    }

    #[Route('/send-verification', name: 'app_send_verification', methods: ['POST'])]
    public function sendVerification(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation
        $constraints = new Assert\Collection([
            'email' => [new Assert\Email(), new Assert\NotBlank()],
            'phone' => [new Assert\NotBlank()],
        ]);

        $violations = $validator->validate($data, $constraints);
        if (count($violations) > 0) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $email = $data['email'];
        $phone = $data['phone'];

        // Check if email already exists
        $existingUser = $this->getDoctrine()->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return $this->json(['error' => 'Email already exists'], 409);
        }

        // Generate verification code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store in cache (15 minutes expiration)
        $cacheKey = 'verification_' . md5($email . $phone);
        $this->cache->set($cacheKey, [
            'code' => $code,
            'email' => $email,
            'phone' => $phone,
            'created_at' => new \DateTime()
        ], 900); // 15 minutes

        // Send email (in production, use real email service)
        try {
            $emailMessage = (new Email())
                ->from('noreply@microlearn.com')
                ->to($email)
                ->subject('MicroLearn - Code de vérification')
                ->html("
                    <h2>Code de vérification</h2>
                    <p>Votre code de vérification pour MicroLearn est :</p>
                    <h1 style='font-size: 32px; color: #6B46C1; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;'>
                        {$code}
                    </h1>
                    <p>Ce code expirera dans 15 minutes.</p>
                    <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
                ");

            $this->mailer->send($emailMessage);
        } catch (\Exception $e) {
            // For development, return the code in response
            return $this->json([
                'message' => 'Verification code sent (development mode)',
                'code' => $code, // Remove this in production
                'cache_key' => $cacheKey
            ]);
        }

        return $this->json([
            'message' => 'Verification code sent successfully',
            'cache_key' => $cacheKey
        ]);
    }

    #[Route('/verify-code', name: 'app_verify_code', methods: ['POST'])]
    public function verifyCode(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation
        $constraints = new Assert\Collection([
            'cache_key' => [new Assert\NotBlank()],
            'code' => [new Assert\NotBlank(), new Assert\Length(['min' => 6, 'max' => 6])],
        ]);

        $violations = $validator->validate($data, $constraints);
        if (count($violations) > 0) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $cacheKey = $data['cache_key'];
        $submittedCode = $data['code'];

        // Get cached verification data
        $verificationData = $this->cache->get($cacheKey);
        if (!$verificationData) {
            return $this->json(['error' => 'Verification code expired or invalid'], 400);
        }

        // Verify code
        if ($verificationData['code'] !== $submittedCode) {
            return $this->json(['error' => 'Invalid verification code'], 400);
        }

        // Check expiration (15 minutes)
        $createdAt = $verificationData['created_at'];
        $now = new \DateTime();
        $diff = $now->getTimestamp() - $createdAt->getTimestamp();
        if ($diff > 900) { // 15 minutes
            $this->cache->delete($cacheKey);
            return $this->json(['error' => 'Verification code expired'], 400);
        }

        // Mark as verified
        $verificationData['verified'] = true;
        $this->cache->set($cacheKey, $verificationData, 900);

        return $this->json([
            'message' => 'Code verified successfully',
            'verified' => true,
            'email' => $verificationData['email'],
            'phone' => $verificationData['phone']
        ]);
    }

    #[Route('/register-verified', name: 'app_register_verified', methods: ['POST'])]
    public function registerVerified(Request $request, ValidatorInterface $validator, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation
        $constraints = new Assert\Collection([
            'cache_key' => [new Assert\NotBlank()],
            'nom' => [new Assert\NotBlank(), new Assert\Length(['min' => 2])],
            'prenom' => [new Assert\NotBlank(), new Assert\Length(['min' => 2])],
            'password' => [new Assert\NotBlank(), new Assert\Length(['min' => 6])],
        ]);

        $violations = $validator->validate($data, $constraints);
        if (count($violations) > 0) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $cacheKey = $data['cache_key'];

        // Get cached verification data
        $verificationData = $this->cache->get($cacheKey);
        if (!$verificationData || !isset($verificationData['verified']) || !$verificationData['verified']) {
            return $this->json(['error' => 'Email not verified'], 400);
        }

        // Check if user already exists (double check)
        $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $verificationData['email']]);
        if ($existingUser) {
            return $this->json(['error' => 'User already exists'], 409);
        }

        // Create user
        $user = new User();
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setEmail($verificationData['email']);
        $user->setTelephone($verificationData['phone']);
        $user->setPassword(password_hash($data['password'], PASSWORD_DEFAULT));
        $user->setCreatedAt(new \DateTime());
        $user->setIsVerified(true);

        $em->persist($user);
        $em->flush();

        // Clear cache
        $this->cache->delete($cacheKey);

        return $this->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
            ]
        ]);
    }
}
