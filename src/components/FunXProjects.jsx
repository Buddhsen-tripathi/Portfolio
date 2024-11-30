import React from 'react';
import funProject1 from "../assets/funproject1.png";
import Reveal from './Reveal';

const funProjects = [
    {
        img: funProject1,
        title: "Japanese Lucky Birthday Rankings 2025",
        description: "Simple tool which ranks your birthday based on the Japanese Luck Calendar 2025",
        links: {
            site: "2025-birthday-rankings",
        },
    }
];

const FunXProjects = () => {
    return (
        <div className="max-w-[1000px] mx-auto p-6 md:my-20" id="funxprojects">
            <Reveal>
                <h2 className="text-4xl font-bold text-center text-gray-200 mb-12">Fun X Projects</h2>
                {funProjects.map((project, index) => (
                    <Reveal key={index}>
                        <div
                            className={`flex flex-col md:flex-row ${
                                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                            } mb-12`}
                        >
                            <div className="w-full md:w-1/2 p-6">
                                <img
                                    src={project.img}
                                    alt={project.title}
                                    className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                            </div>
                            <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
                                <h3 className="text-2xl font-semibold text-gray-200 mb-4">
                                    {project.title}
                                </h3>
                                <p className="text-gray-300 mb-4">{project.description}</p>
                                <div className="flex space-x-4">
                                    <a
                                        href={project.links.site}
                                        className="px-4 py-2 bg-slate-600 text-gray-200 rounded-lg hover:bg-slate-700 transition duration-300"
                                    >
                                        View Project
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </Reveal>
        </div>
    );
};

export default FunXProjects;