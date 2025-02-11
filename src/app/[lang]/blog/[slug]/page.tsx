
import { notFound } from 'next/navigation';
import { ChevronLeft, Share2, Bookmark, Tag, Calendar, Clock } from 'lucide-react';
import {BlogPost, getBlogPost} from "@/lib/api/blogs";
import Image from "next/image";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { formatDistanceToNow } from 'date-fns';
import {Metadata} from "next";

interface BlogDetailProps {
    params: {
        slug: string;
        lang: string;
    };
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
    // Fetch blog post data
    const post: BlogPost = await getBlogPost(params.slug);

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://predictionsport.com/${params.lang}/blog/${params.slug}`,
            type: 'article',
            publishedTime: post.publishDate,
            authors: [post.author],
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title
                }
            ]
        },
        // ... rest of metadata
    }
}


export default async function BlogDetailPage({ params }: BlogDetailProps) {
    const post = await getBlogPost(params.slug);

    console.log(post)

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <button
                        className="text-gray-600"
                    >
                        <Link href="/blog" className="text-gray-600">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <article>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8">
                  {/*          <div className="flex flex-wrap gap-2 mb-4">*/}
                  {/*              {post.tags.map((tag) => (*/}
                  {/*                  <span*/}
                  {/*                      key={tag}*/}
                  {/*                      className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full"*/}
                  {/*                  >*/}
                  {/*  {tag}*/}
                  {/*</span>*/}
                  {/*              ))}*/}
                  {/*          </div>*/}

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-between py-6 border-y">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        width={50}
                                        height={70}
                                        className="rounded-full"
                                    />

                                    <div>
                                        <div className="font-medium text-gray-900">{post.author.name}</div>
                                        <div className="text-sm text-gray-500">{post.author.role}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDistanceToNow(post.publishDate, { addSuffix: true })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {post.readTime}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-96">
                            <Image
                                src={post.image}
                                alt={post.title}
                                width={1000}
                                height={500}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="prose prose-lg max-w-none">
                                {/*<div dangerouslySetInnerHTML={{ __html: post.content }} />*/}
                                <div>
                                    {documentToReactComponents(post.content.json)}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-8 pt-8 border-t">
                                <div className="flex items-center gap-2">
                                    <button
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share Article
                                    </button>
                                    <button
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <Bookmark className="w-4 h-4" />
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <Image src={post.author.avatar} alt={post.author.name} width={50} height={50} className="rounded-full"/>
                            <div>
                                <h3 className="font-medium text-gray-900">Written by {post.author.name}</h3>
                                <p className="text-gray-500 mt-1">{post.author.role}</p>
                            </div>
                        </div>
                    </div>

                    {/*{post.relatedPosts.length > 0 && (*/}
                    {/*    <div className="mt-12">*/}
                    {/*        <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>*/}
                    {/*        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">*/}
                    {/*            {post.relatedPosts.map((relatedPost) => (*/}
                    {/*                <Card key={relatedPost.id} className="group">*/}
                    {/*                    <div className="relative h-48">*/}
                    {/*                        <img*/}
                    {/*                            src={relatedPost.image}*/}
                    {/*                            alt={relatedPost.title}*/}
                    {/*                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"*/}
                    {/*                        />*/}
                    {/*                        <div className="absolute top-4 left-4">*/}
                    {/*    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full">*/}
                    {/*      {relatedPost.category}*/}
                    {/*    </span>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                    <div className="p-4">*/}
                    {/*                        <h3 className="font-semibold text-gray-900 mb-2">*/}
                    {/*                            {relatedPost.title}*/}
                    {/*                        </h3>*/}
                    {/*                        <p className="text-sm text-gray-600 mb-4">*/}
                    {/*                            {relatedPost.excerpt}*/}
                    {/*                        </p>*/}
                    {/*                        <div className="flex items-center justify-between text-sm text-gray-500">*/}
                    {/*                            <span>{relatedPost.date}</span>*/}
                    {/*                            <span>{relatedPost.readTime}</span>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </Card>*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </article>
            </div>
        </div>
    );
}