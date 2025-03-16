import RSS from 'rss';
import { BlogPost } from '@/app/blogs/BlogList';
import { getAllBlogPosts } from '@/app/blogs/utils';

const parseDate = (dateStr: string | undefined): string => {
    if (!dateStr) return new Date().toISOString();
    const [dd, mm, yyyy] = dateStr.split("-").map(Number);
    const formattedDate = new Date(`${yyyy}-${mm}-${dd}`);
    return isNaN(formattedDate.getTime()) ? new Date().toISOString() : formattedDate.toISOString();
}; 

export async function GET() {
    const feed = new RSS({
        title: "Buddhsen Tripathi's Blog",
        description: 'Web development insights and tutorials',
        site_url: 'https://buddhsentripathi.com',
        feed_url: 'https://buddhsentripathi.com/feed.xml',
        language: 'en',
        generator: 'Next.js using RSS',
        pubDate: new Date(),
    });

    try {
        // Get the same blog posts that are used in BlogList
        const blogPosts: BlogPost[] = await getAllBlogPosts();

        blogPosts.forEach((post) => {
            feed.item({
                title: post.title,
                description: post.excerpt,
                url: `https://buddhsentripathi.com/blogs/${post.slug}`,
                date: parseDate(post.date),
                guid: post.slug,
            });
        });

        return new Response(feed.xml({ indent: true }), {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    } catch (error) {
        return new Response('Error generating feed', { status: 500 });
    }
}