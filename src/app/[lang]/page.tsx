'use client';

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/app/[lang]/langing/Navbar";
import NewsHighlights from "@/app/[lang]/langing/NewsHighlights";
import NewsletterSignup from "@/app/[lang]/langing/NewsletterSignup";
import FeaturedPredictions from "@/components/FeaturedPredictions";

export default function Home() {
  const { locale, dictionary } = useLanguage();

  return (
    <div>
      <Navbar />

      {/* Featured Predictions Section with Sidebar Filters */}
      <FeaturedPredictions locale={locale} dictionary={dictionary} />

      {/* News Highlights Section */}
      <NewsHighlights />

      {/* Newsletter Signup Section */}
      <NewsletterSignup />
    </div>
  );
}
