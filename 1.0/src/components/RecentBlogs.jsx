import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Reveal from './Reveal';

const RecentBlogs = () => {
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

                        const parts = content.split('---');
                        if (parts.length < 2) return null;

                        const frontmatter = parts[1];

                        const metadata = {};
                        frontmatter.split('\n').forEach(line => {
                            if (line.trim()) {
                                const [key, ...valueParts] = line.split(':');
                                if (key && valueParts.length) {
                                    const value = valueParts.join(':').trim();
                                    metadata[key.trim()] = value.replace(/^"(.*)"$/, '$1');
                                }
                            }
                        });

                        return {
                            title: metadata.title || '',
                            datePublished: metadata.datePublished || '',
                            slug: file.name.replace('.md', ''),
                            externalSlug: metadata.slug || file.name.replace('.md', ''),
                            description: metadata.seoDescription || ''
                        };
                    })
                );

                const validPosts = postsData.filter(post => post !== null);
                validPosts.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));

                setPosts(validPosts.slice(0, 2));
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-200">Loading...</div>;
    }

    return (
        <div className="recent-blogs mt-12 max-w-[1000px] mx-auto" id="recentblogs">
            <Reveal>
            <h2 className="text-4xl font-bold text-center text-gray-200 mb-8">Recent Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                    <div key={post.slug} className="p-6 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors shadow-md relative">
                        <Reveal>
                        <h3 className="text-2xl font-semibold text-gray-200">{post.title}</h3>
                        <p className="text-gray-400 mt-2">
                            {new Date(post.datePublished).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        </Reveal>
                        {post.description && (
                            <Reveal><p className="text-gray-300 mt-2">{post.description}</p></Reveal>
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
            <div className="flex justify-center py-6">
                <motion.button
                    whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.3)" }}
                    className="z-10 cursor-pointer font-bold text-gray-200 md:w-auto p-4 border border-purple-400 rounded-xl"
                >
                    <a href="/blogs">More Blogs</a>
                </motion.button>
            </div>
            </Reveal>
        </div>
    );
};

export default RecentBlogs;