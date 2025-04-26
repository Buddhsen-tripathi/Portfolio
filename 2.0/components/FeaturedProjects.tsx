'use client'
const projects = [
  {
    title: "DeepFind.Me",
    image: "/dfme.webp",
    description: "Deepfind.me is an educational OSINT platform offering tools and resources to help users understand and manage their digital footprint.",
    github: null,
    demo: "https://deepfind.me?ref=buddhsen-tripathi",
    technologies: ["Next.Js", "NestJs", "Supabase", "Web Crypto API", "OpenAI API"],
  },
  {
    title: "Craftfolio",
    image: "/craftfolio.webp",
    description: "Craftfolio is a resume builder that allows users to create and customize their resumes using various templates and sections.",
    github: null,
    demo: "https://www.buddhsentripathi.com/craftfolio",
    technologies: ["Next.Js", "TypeScript", "Tailwind CSS", "PDFKit", "Gemini API"],
  },
  {
    title: "openai-api-helper",
    image: "/openai-helper.webp",
    description: "Straightforward npm package designed to simplify making calls to the OpenAI API for various text-based prompts and responses.",
    github: "https://github.com/Buddhsen-tripathi/openai-api-helper",
    demo: "https://www.npmjs.com/package/openai-api-helper",
    technologies: ["JavaScript", "TypeScript"],
  },
  {
    title: "SmartText Enhancer",
    image: "/sme.webp",
    description: "Productivity-focused Chrome extension that uses AI to summarize content and check spelling and grammar.",
    github: null,
    demo: "https://chromewebstore.google.com/detail/smarttext-enhancer/chmpfoicecijpgmgcpnfhakmeaofmipm",
    technologies: ["JavaScript", "HTML", "CSS", "Express", "OpenAI API"],
  }
];

const funnyProjects = [
  {
    title: "Twitter/X Spam Check",
    image: "/spam-or-not.webp",
    description: "Enter a Twitter/X username to analyze their recent activity for potential spam-like behavior using AI.",
    github: null,
    demo: "https://www.buddhsentripathi.com/spam-or-not",
    technologies: [],
    path: "spam-or-not"
  },
  {
    title: "Linkedinfy My Post",
    image: "/linkedinfy.webp",
    description: "Transform your posts into high-engagement LinkedIn content in seconds. Optimize, refine, and stand out effortlessly.",
    github: null,
    demo: "https://www.buddhsentripathi.com/linkedinfy-my-post",
    technologies: [],
    path: "linkedinfy-my-post"
  },
  {
    title: "Code Runner",
    image: "/code-runner.webp",
    description: "A fast-paced game where you dodge bugs and climb the leaderboard. Sharpen your reflexes and aim for the top.",
    github: null,
    demo: "https://www.buddhsentripathi.com/code-runner",
    technologies: [],
    path: "code-runner"
  },
  {
    title: "Japanese Lucky Birthday Rankings 2025",
    image: "/2025b.webp",
    description: "Simple tool which ranks your birthday based on the Japanese Luck Calendar 2025.",
    github: null,
    demo: "https://www.buddhsentripathi.com/2025-birthday-rankings",
    technologies: [],
    path: "2025-birthday-rankings"
  },
];

import Image from 'next/image'
import Link from 'next/link'
import { SiGithub } from "react-icons/si";
import { BsArrowUpRight, BsArrowRight } from "react-icons/bs";
import { usePathname } from 'next/navigation'
import ViewCounter from './ViewCounter';

export default function FeaturedProjects() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="space-y-4">
        {projects.slice(0, isHomePage ? 2 : projects.length).map((project) => (
          <div key={project.title} className="flex flex-col md:flex-row gap-6 bg-card rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg hover:bg-primary/5 border dark:border-gray-700 shadow-gray-200 dark:shadow-gray-800">
            <div className="md:w-2/5 w-full h-full relative">
              <Image
                src={project.image}
                alt={project.title}
                width={640}
                height={360}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-3/5 p-4">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="mb-4 mt-4">{project.description}</p>
              <div className="flex space-x-4">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    <SiGithub className="inline-block mr-1" /> GitHub
                  </a>
                )}
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  <BsArrowUpRight className="inline-block mr-1" /> Live
                </a>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isHomePage && (
        <div className="mt-4 flex justify-center w-full">
          <Link href="/projects" className="w-full">
            <div className="w-full bg-card text-card-foreground rounded-lg shadow-md hover:shadow-lg transition-all py-3 border dark:border-gray-700 shadow-gray-200 dark:shadow-gray-800 flex items-center justify-center gap-2 dark:hover:bg-primary/5 dark:hover:text-primary">
              <span>View more</span>
              <BsArrowRight className="inline-block" />
            </div>
          </Link>
        </div>
      )}

      {/* Funny X Projects Section */}
      {!isHomePage && (<section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">𝕏 Projects</h2>
        <h3
          className="text-lg font-semibold mb-4"
          aria-label="I make random projects to engage my Twitter/X community"
        >
          Random projects to engage my 𝕏 community (<a href="https://x.com/intent/follow?screen_name=btr1pathi" className='text-blue-500'>@btr1pathi</a>)
        </h3>
        <div className="space-y-4">
          {funnyProjects.map((project) => (
            <div key={project.title} className="flex flex-col md:flex-row gap-6 bg-card rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg hover:bg-primary/5 border dark:border-gray-700 shadow-gray-200 dark:shadow-gray-800">
              <div className="md:w-2/5 w-full h-full relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={640}
                  height={360}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="mb-4 mt-4">{project.description}</p>
                {project.path && <p className="mb-4 mt-4"><ViewCounter slug={project.path} readOnly={true} /></p>}
                <div className="flex space-x-4">
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    <BsArrowUpRight className="inline-block mr-1" /> Live
                  </a>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}
    </section>
  )
}