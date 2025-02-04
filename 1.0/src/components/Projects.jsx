import React from 'react';
import project1 from "../assets/project1.webp"
import project2 from "../assets/project2.webp"

import { AiFillGithub } from 'react-icons/ai'
import Reveal from './Reveal';

const projects = [
    {
        img: project1,
        title: "openai-api-helper",
        description: "Straightforward npm package designed to simplify making calls to the OpenAI API for various text-based prompts and responses.",
        links: {
            site: "https://www.npmjs.com/package/openai-api-helper",
            github: "https://github.com/Buddhsen-tripathi/openai-api-helper",
        }
    },
    {
        img: project2,
        title:"SmartText Enhancer",
        description: "Productivity-focused Chrome extension that uses AI to summarize content and check spelling and grammar.",
        links: {
            site: "https://chromewebstore.google.com/detail/smarttext-enhancer/chmpfoicecijpgmgcpnfhakmeaofmipm"
        }
    }
]

const Project = () => {
    return (
        <div className='max-w-[1000px] mx-auto p-6 md:my-20' id="project">
            <Reveal>
                <h2 className='text-4xl font-bold text-center text-gray-200 mb-12'>Projects</h2>
                {projects.map((project, index) => (
                    <Reveal>
                        <div key={index}
                            className={`flex flex-col md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} mb-12`}>
                            <div className='w-full md:w-1/2 p-6'>
                                <img
                                    src={project.img}
                                    alt={project.title}
                                    className='w-full h-full object-cover rounded-lg shadow-lg'
                                />
                            </div>
                            <div className='w-full md:w-1/2 p-4 flex flex-col justify-center'>
                                <h3 className='text-2xl font-semibold text-gray-200 mb-4'>{project.title}</h3>
                                <p className='text-gray-300 mb-4'>{project.description}</p>
                                <div className='flex space-x-4'>
                                    <a href={project.links.site}
                                        className='px-4 py-2 bg-slate-600 text-gray-200 rounded-lg hover:bg-slate-700
                                        transition duration-300' target="_blank">
                                        View Site
                                    </a>
                                    <a href={project.links.github}
                                        className='px-4 py-2 bg-slate-600 text-gray-200 rounded-lg hover:bg-slate-700
                                        transition duration-300' target="_blank">
                                        <AiFillGithub/>
                                    </a>

                                </div>

                            </div>

                        </div>
                    </Reveal>
                ))}
            </Reveal>

        </div>
    )
}

export default Project;