import { motion } from 'framer-motion';
import { Clock, ChevronRight, BookOpen, Share2, Calendar } from 'lucide-react';
import {useEffect, useState} from "react";
import NewsCard from "@/components/NewsCard";
import {formatDistanceToNow} from "date-fns";
import Link from "next/link";



const categories = ["Latest"];

export default function NewsHighlights() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getNews = async () => {
        setLoading(true);
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=http://newsrss.bbc.co.uk/rss/sportonline_uk_edition/football/rss.xml');
        const data = await response.json();
        console.log(data);
        setNews(data.items);
        setLoading(false);
        setError(false);
        return data.items;
    };

    useEffect(() => {
        getNews();
    }, []);

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Latest News</h2>
                        <p className="text-gray-600 mt-2">Stay updated with football's latest developments</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${category === "Latest"
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.splice(0,4).map((newsItem, index) => (
                        <NewsCard
                            id={index + 1}
                            slug={newsItem.link}
                            title={newsItem.title}
                            excerpt={newsItem.description}
                            category={newsItem.category}
                            image={newsItem.thumbnail}
                            date={newsItem?.pubDate && formatDistanceToNow(newsItem?.pubDate, { addSuffix: true })}
                            readTime={newsItem.readTime}
                        />
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <Link href="/news" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        View All News
                    </Link>
                </div>
            </div>
        </section>
    );
}