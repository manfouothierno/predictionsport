// app/blog/sitemap.ts
import type { MetadataRoute } from 'next'
import {BlogPost, getBlogPosts} from "@/lib/api/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch blog posts from your CMS
    const posts: BlogPost[] = await getBlogPosts();
    const baseUrl = 'https://predictionsport.com'
    const languages = ['en', 'fr', 'de', 'es']

    return posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishDate,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
            languages: languages.reduce((acc, lang) => ({
                ...acc,
                [lang]: `${baseUrl}/${lang}/blog/${post.slug}`
            }), {})
        }
    }))
}
