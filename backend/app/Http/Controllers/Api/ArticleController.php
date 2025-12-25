<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    /**
     * Display a listing of all articles.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Article::query();

        // Filter by enhanced status
        if ($request->has('enhanced')) {
            $query->where('is_enhanced', $request->boolean('enhanced'));
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $articles = $query->orderBy('published_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Store a newly created article.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'original_url' => 'nullable|url',
            'featured_image' => 'nullable|url',
            'published_at' => 'nullable|date',
            'is_enhanced' => 'nullable|boolean',
            'enhanced_content' => 'nullable|string',
            'references' => 'nullable|array',
            'meta_description' => 'nullable|string|max:255',
            'meta_keywords' => 'nullable|string|max:255',
        ]);

        // Generate slug from title
        $validated['slug'] = Str::slug($validated['title']);
        
        // Ensure unique slug
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (Article::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        $article = Article::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Article created successfully',
            'data' => $article,
        ], 201);
    }

    /**
     * Display the specified article.
     */
    public function show(Article $article): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    /**
     * Update the specified article.
     */
    public function update(Request $request, Article $article): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'excerpt' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'original_url' => 'nullable|url',
            'featured_image' => 'nullable|url',
            'published_at' => 'nullable|date',
            'is_enhanced' => 'nullable|boolean',
            'enhanced_content' => 'nullable|string',
            'references' => 'nullable|array',
            'meta_description' => 'nullable|string|max:255',
            'meta_keywords' => 'nullable|string|max:255',
        ]);

        // Update slug if title changes
        if (isset($validated['title']) && $validated['title'] !== $article->title) {
            $validated['slug'] = Str::slug($validated['title']);
            
            // Ensure unique slug
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (Article::where('slug', $validated['slug'])->where('id', '!=', $article->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $article->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Article updated successfully',
            'data' => $article,
        ]);
    }

    /**
     * Remove the specified article.
     */
    public function destroy(Article $article): JsonResponse
    {
        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully',
        ]);
    }

    /**
     * Get the latest article.
     */
    public function latest(): JsonResponse
    {
        $article = Article::where('is_enhanced', false)
            ->orderBy('published_at', 'desc')
            ->first();

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'No articles found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    /**
     * Get all original articles (not enhanced).
     */
    public function originals(): JsonResponse
    {
        $articles = Article::where('is_enhanced', false)
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Get all enhanced articles.
     */
    public function enhanced(): JsonResponse
    {
        $articles = Article::where('is_enhanced', true)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }
}

