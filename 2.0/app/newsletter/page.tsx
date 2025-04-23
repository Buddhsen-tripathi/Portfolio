import NewsletterSubscription from "@/components/NewsletterSubscription";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Newsletter - Buddhsen Tripathi",
    description: "Subscribe to my newsletter for updates on web development, AI, and personal projects.",
    openGraph: {
        title: "Newsletter - Buddhsen Tripathi",
        description: "Subscribe to my newsletter for updates on web development, AI, and personal projects.",
        url: "https://buddhsentripathi.com/newsletter",
        // images: [
        //     {
        //         url: "/default-image.webp",
        //         width: 1200,
        //         height: 630,
        //         alt: "Newsletter Subscription",
        //     },
        // ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Newsletter - Buddhsen Tripathi",
        description: "Subscribe to my newsletter for updates on web development, AI, and personal projects.",
        images: ["/default-image.webp"],
    },
};


export default function NewsletterPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                    Join My Newsletter
                </h1>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
                    Stay ahead of the curve! Subscribe to Buddhsen Tripathi's newsletter for exclusive updates on web development, AI insights, personal projects, and the latest tech trends.
                </p>

                <NewsletterSubscription />

                <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    You can unsubscribe at any time. Your privacy is respected.
                </p>
            </div>
        </div>
    );
}