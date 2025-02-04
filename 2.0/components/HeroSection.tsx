import Image from 'next/image'
import { SiX, SiLinkedin, SiGithub, SiBuymeacoffee, SiYoutube, SiLeetcode } from "react-icons/si";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16">
      <div className="w-48 h-48 relative flex-shrink-0 rounded-full overflow-hidden shadow-lg">
        <Image
          src="/profpic.webp"
          alt="Buddhsen Tripathi"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center md:items-start space-y-4">
        <h1 className="text-4xl font-bold">Buddhsen Tripathi</h1>
        <p className="max-w-2xl text-center md:text-left text-muted-foreground">
          Hello! I'm a passionate web developer with expertise in React, Next.js, and TypeScript.
          I love creating responsive and user-friendly web applications. With a keen eye for design
          and a strong foundation in modern web technologies, I strive to deliver high-quality
          solutions that meet both user needs and business goals.
        </p>
        <div className="flex space-x-4">
          <a href="https://github.com/buddhsen-tripathi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiGithub className="w-6 h-6" />
          </a>
          <a href="https://linkedin.com/in/buddhsen-tripathi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiLinkedin className="w-6 h-6" />
          </a>
          <a href="https://twitter.com/_TripathiJi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiX className="w-6 h-6" />
          </a>
          <a href="https://leetcode.com/u/buddhsen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiLeetcode className="w-6 h-6" />
          </a>
          <a href="https://www.youtube.com/@64TechBits" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiYoutube className="w-6 h-6" />
          </a>
          <a href="https://buymeacoffee.com/buddhsentripathi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiBuymeacoffee className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  )
}