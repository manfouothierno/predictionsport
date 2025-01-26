import { motion } from 'framer-motion';
import { Clock, ChevronRight, BookOpen, Share2, Calendar } from 'lucide-react';

const news = [
    {
        id: 1,
        title: "Manchester City's Key Player Returns from Injury",
        excerpt: "After two months on the sidelines, the midfielder is set to make his comeback in the crucial Champions League fixture.",
        category: "Transfers",
        timestamp: "2h ago",
        image: "/news/news1.jpg",
        readTime: "3 min read",
        date: "26 Jan 2025"
    },
    {
        id: 2,
        title: "Manchester City's Key Player Returns from Injury",
        excerpt: "After two months on the sidelines, the midfielder is set to make his comeback in the crucial Champions League fixture.",
        category: "Transfers",
        timestamp: "2h ago",
        image: "/news/news1.jpg",
        readTime: "3 min read",
        date: "26 Jan 2025"
    },
    {
        id: 3,
        title: "Manchester City's Key Player Returns from Injury",
        excerpt: "After two months on the sidelines, the midfielder is set to make his comeback in the crucial Champions League fixture.",
        category: "Transfers",
        timestamp: "2h ago",
        image: "/news/news1.jpg",
        readTime: "3 min read",
        date: "26 Jan 2025"
    },
    // Add more news
];

const categories = ["All", "Transfers", "Injuries", "Match Reports", "Analysis"];

export default function NewsHighlights() {
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
                  ${category === "All"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <motion.article
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-2">
                    {item.category}
                  </span>
                                    <h3 className="text-xl font-bold text-white line-clamp-2">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {item.date}
                                    </div>
                                    <div className="flex items-center">
                                        <BookOpen className="w-4 h-4 mr-1" />
                                        {item.readTime}
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6 line-clamp-3">
                                    {item.excerpt}
                                </p>

                                <div className="flex justify-between items-center">
                                    <button className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center group">
                                        Read More
                                        <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        View All News
                    </button>
                </div>
            </div>
        </section>
    );
}