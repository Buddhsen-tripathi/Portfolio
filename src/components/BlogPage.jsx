import React, { useState, useEffect } from 'react';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await fetch(
                    'https://api.github.com/repos/Buddhsen-tripathi/Hashnode-BlogPosts/contents'
                );
                if (!response.ok) throw new Error('Failed to fetch posts');

                const files = await response.json();
                const mdFiles = files.filter(file => file.name.endsWith('.md'));

                const postsData = await Promise.all(
                    mdFiles.map(async file => {
                        const contentResponse = await fetch(file.download_url);
                        const content = await contentResponse.text();

                        // Split content to get frontmatter
                        const parts = content.split('---');
                        if (parts.length < 2) return null;

                        const frontmatter = parts[1];

                        // Parse frontmatter line by line
                        const metadata = {};
                        frontmatter.split('\n').forEach(line => {
                            if (line.trim()) {
                                const [key, ...valueParts] = line.split(':');
                                if (key && valueParts.length) {
                                    const value = valueParts.join(':').trim();
                                    // Remove quotes if they exist
                                    metadata[key.trim()] = value.replace(/^"(.*)"$/, '$1');
                                }
                            }
                        });

                        return {
                            title: metadata.title || '',
                            datePublished: metadata.datePublished || '',
                            slug: file.name.replace('.md', ''),
                            externalSlug: metadata.slug || file.name.replace('.md', ''), // Slug for external URL
                            description: metadata.seoDescription || ''
                        };
                    })
                );

                // Filter out any null values and sort by date
                const validPosts = postsData.filter(post => post !== null);
                validPosts.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));

                setPosts(validPosts);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    if (loading) {
        return (
            <div className="mx-auto mt-24 px-12 max-w-[1200px] text-gray-200">
                <h1 className="text-3xl font-bold mb-6">Blogs</h1>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-24 px-12 max-w-[1200px] text-gray-200">
            <meta name="google-adsense-account" content="ca-pub-8627226194830904"></meta>
            <h1 className="text-3xl font-bold mb-6">Blogs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.slug} className="p-6 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors shadow-md">
                        <h2 className="text-2xl font-semibold">{post.title}</h2>
                        <p className="text-gray-400 mt-2">
                            {new Date(post.datePublished).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        {post.description && (
                            <p className="text-gray-300 mt-2">{post.description}</p>
                        )}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-2 mt-3">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="text-sm bg-gray-700 px-2 py-1 rounded-full text-gray-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <a
                            href={`https://blog.buddhsentripathi.com/${post.externalSlug}`}
                            className="absolute bottom-4 left-6 text-blue-400 hover:text-blue-300 font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read more →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
