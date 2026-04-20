<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__.'/backend')
    ->name('*.php');

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'strict_comparison' => true,
        'no_unused_imports' => true,
        'array_syntax' => ['syntax' => 'short'],
        'no_trailing_whitespace' => true,
    ])
    ->setFinder($finder);