"use client";

import { NextSeo } from "next-seo";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

export default function SEO({ title, description, url, image }: SEOProps) {
  const defaultTitle = "Buddhsen Tripathi";
  const defaultDescription = "Hey, I'm Buddhsen Tripathi – a Fullstack Developer who loves building cool stuff, experimenting with AI, and simplifying cybersecurity. Explore my projects, blogs, and let's connect";
  const defaultURL = "https://buddhsentripathi.com";
  const defaultImage = "https://buddhsentripathi.com/default-image.webp";

  return (
    <NextSeo
      title={title || defaultTitle}
      description={description || defaultDescription}
      openGraph={{
        title: title || defaultTitle,
        description: description || defaultDescription,
        url: url || defaultURL,
        images: [{ url: image || defaultImage }],
        type: "website",
      }}
    />
  );
}
