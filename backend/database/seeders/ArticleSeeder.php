<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Your website needs a receptionist',
                'content' => '<p>So true! Not having an interactive element like chatbot on a website significantly reduces traffic retention. A chatbot acts as your 24/7 receptionist, greeting visitors, answering questions, and guiding them through your site.</p><h2>Why Your Website Needs a Virtual Receptionist</h2><p>In today\'s fast-paced digital world, visitors expect instant responses. A chatbot can provide immediate assistance, improving user experience and increasing conversion rates.</p>',
                'excerpt' => 'Not having an interactive element like chatbot on a website significantly reduces traffic retention.',
                'author' => 'BeyondChats',
                'original_url' => 'https://beyondchats.com/blogs/your-website-needs-a-receptionist/',
                'published_at' => '2025-03-25',
                'is_enhanced' => false,
            ],
            [
                'title' => 'AI in Healthcare: Hype or Reality?',
                'content' => '<p>Artificial Intelligence is revolutionizing healthcare in ways we never imagined. From diagnostic tools to personalized treatment plans, AI is making healthcare more accessible and accurate.</p><h2>The Current State of AI in Healthcare</h2><p>Machine learning algorithms can now detect diseases from medical images with accuracy rivaling human doctors. This is not science fiction – it\'s happening in hospitals around the world today.</p>',
                'excerpt' => 'Exploring how AI is transforming the healthcare industry and what it means for patients and providers.',
                'author' => 'BeyondChats',
                'original_url' => 'https://beyondchats.com/blogs/ai-in-healthcare/',
                'published_at' => '2025-03-20',
                'is_enhanced' => false,
            ],
            [
                'title' => 'What If AI Recommends the Wrong Medicine – Who\'s Responsible?',
                'content' => '<p>As AI becomes more prevalent in healthcare, questions of liability and accountability become increasingly important. When an AI system makes a recommendation that leads to harm, who bears the responsibility?</p><h2>The Accountability Question</h2><p>This complex issue involves multiple stakeholders: the AI developers, healthcare providers, hospitals, and regulatory bodies.</p>',
                'excerpt' => 'Exploring the ethical and legal implications of AI-driven medical recommendations.',
                'author' => 'BeyondChats',
                'original_url' => 'https://beyondchats.com/blogs/ai-medical-liability/',
                'published_at' => '2025-03-15',
                'is_enhanced' => false,
            ],
            [
                'title' => 'Your website needs a receptionist (Enhanced)',
                'content' => '<article class="enhanced-article"><header><h1>Your website needs a receptionist</h1><p class="meta">Enhanced Article | Originally by BeyondChats</p></header><section class="introduction"><h2>Introduction</h2><p>In the digital age, your website is often the first point of contact between your business and potential customers. Just like a physical office needs a receptionist to greet visitors and answer questions, your website needs an interactive element to engage visitors and guide them through their journey.</p></section><section class="main-content"><h2>The Problem with Static Websites</h2><p>Static websites fail to engage visitors. Without interactive elements, users often leave without taking any action. Studies show that websites with chatbots see up to 40% higher engagement rates.</p><h2>Benefits of AI Chatbots</h2><ul><li><strong>24/7 Availability:</strong> Unlike human receptionists, chatbots never sleep</li><li><strong>Instant Responses:</strong> No waiting on hold or for email replies</li><li><strong>Scalability:</strong> Handle thousands of conversations simultaneously</li><li><strong>Cost-Effective:</strong> Reduce customer service costs by up to 30%</li></ul></section><section class="conclusion"><h2>Conclusion</h2><p>Implementing a chatbot on your website is no longer optional – it\'s essential for staying competitive in today\'s digital marketplace.</p></section><hr><section class="references"><h2>References</h2><p>This article was enhanced with insights from the following sources:</p><ul><li><a href="https://blog.hubspot.com/service/ai-customer-service" target="_blank">Customer Service AI Trends - HubSpot</a></li></ul></section></article>',
                'excerpt' => 'An enhanced, comprehensive guide to why your website needs an AI chatbot receptionist.',
                'author' => 'BeyondChats',
                'original_url' => 'https://beyondchats.com/blogs/your-website-needs-a-receptionist/',
                'published_at' => '2025-03-26',
                'is_enhanced' => true,
                'references' => json_encode([
                    ['title' => 'Customer Service AI Trends - HubSpot', 'url' => 'https://blog.hubspot.com/service/ai-customer-service']
                ]),
            ],
        ];

        foreach ($articles as $articleData) {
            $articleData['slug'] = Str::slug($articleData['title']);
            
            Article::updateOrCreate(
                ['slug' => $articleData['slug']],
                $articleData
            );
        }
    }
}

