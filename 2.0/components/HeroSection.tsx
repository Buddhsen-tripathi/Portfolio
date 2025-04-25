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
          className="object-cover border-4 border-transparent rounded-full hover:border-[#4299e1] transition-all duration-300"
        />
      </div>
      <div className="flex flex-col items-center md:items-start space-y-4">
        <h1 className="text-4xl font-bold">Buddhsen Tripathi</h1>
        <p className="max-w-2xl text-center md:text-left text-muted-foreground">
          Hello! I'm a passionate full-stack web developer with expertise in React, Next.js, Java and TypeScript.<br/>
          I build responsive, user-friendly web apps with a focus on clean design and solid performance. My goal is to create smart, reliable solutions that work beautifully for users and businesses alike.
        </p>
        <div className="flex space-x-4">
          <a href="https://github.com/buddhsen-tripathi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiGithub className="w-6 h-6" />
          </a>
          <a href="https://linkedin.com/in/buddhsen-tripathi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiLinkedin className="w-6 h-6" />
          </a>
          <a href="https://twitter.com/btr1pathi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
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