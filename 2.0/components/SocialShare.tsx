import React from 'react';
import { SiX, SiLinkedin } from "react-icons/si";

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  return (
    <div className="social-share text-center">
      <h3 className="text-xl font-semibold text-primary mb-4">Share this article</h3>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary bg-primary/20 hover:bg-primary/30 transition-colors"
        >
          <SiX className="w-5 h-5 mr-2" />
          Share on Twitter
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary bg-primary/20 hover:bg-primary/40 transition-colors"
        >
          <SiLinkedin className="w-5 h-5 mr-2" />
          Share on LinkedIn
        </a>
      </div>
    </div>
  );
};

export default SocialShare;