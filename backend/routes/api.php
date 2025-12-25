<?php

use App\Http\Controllers\Api\ArticleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Article CRUD Routes
Route::prefix('articles')->group(function () {
    // Get all articles
    Route::get('/', [ArticleController::class, 'index']);
    
    // Get the latest original article
    Route::get('/latest', [ArticleController::class, 'latest']);
    
    // Get all original articles
    Route::get('/originals', [ArticleController::class, 'originals']);
    
    // Get all enhanced articles
    Route::get('/enhanced', [ArticleController::class, 'enhanced']);
    
    // Create a new article
    Route::post('/', [ArticleController::class, 'store']);
    
    // Get a specific article by slug
    Route::get('/{article}', [ArticleController::class, 'show']);
    
    // Update an article
    Route::put('/{article}', [ArticleController::class, 'update']);
    Route::patch('/{article}', [ArticleController::class, 'update']);
    
    // Delete an article
    Route::delete('/{article}', [ArticleController::class, 'destroy']);
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()->toISOString(),
    ]);
});

