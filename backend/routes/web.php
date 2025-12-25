<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'name' => 'BeyondChats Article API',
        'version' => '1.0.0',
        'description' => 'API for managing scraped and enhanced articles',
        'endpoints' => [
            'GET /api/articles' => 'List all articles',
            'GET /api/articles/latest' => 'Get the latest original article',
            'GET /api/articles/originals' => 'Get all original articles',
            'GET /api/articles/enhanced' => 'Get all enhanced articles',
            'POST /api/articles' => 'Create a new article',
            'GET /api/articles/{slug}' => 'Get a specific article',
            'PUT /api/articles/{slug}' => 'Update an article',
            'DELETE /api/articles/{slug}' => 'Delete an article',
        ],
    ]);
});

