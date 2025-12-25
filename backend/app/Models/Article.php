<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'author',
        'original_url',
        'featured_image',
        'published_at',
        'is_enhanced',
        'enhanced_content',
        'references',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_enhanced' => 'boolean',
        'references' => 'array',
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Scope to get only enhanced articles.
     */
    public function scopeEnhanced($query)
    {
        return $query->where('is_enhanced', true);
    }

    /**
     * Scope to get only original articles.
     */
    public function scopeOriginal($query)
    {
        return $query->where('is_enhanced', false);
    }

    /**
     * Get the latest article.
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('published_at', 'desc');
    }
}

