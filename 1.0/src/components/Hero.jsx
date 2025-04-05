import React from "react";
import profilepic from "../assets/profpic.webp"
import { TypeAnimation } from "react-type-animation"
import ShinyEffect from "./ShinyEffect"
import { Link } from 'react-scroll'

import {
    AiOutlineGithub,
    AiOutlineX,
    AiOutlineLinkedin,
} from "react-icons/ai";

import { motion } from "framer-motion";

const Hero = () => {
    return (
        <div className="mt-24 max-w-[1200px] mx-auto relative">
            <div className="grid md:grid-cols-2 place-items-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <TypeAnimation
                        sequence={[
                            "Fullstack Developer",
                            1100,
                            "AI ML Enthusiast",
                            1100,
                        ]}
                        speed={50}
                        repeat={Infinity}
                        className="font-bold text-gray-400 text-lg md:text-5xl italic- mb-4"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-gray-200 md:text-5xl text-3xl tracking-tight mb-4"
                    >
                        <br />
                        Hey, I'm <br />
                        <span className="text-purple-500 md:text-5xl text-3xl">Buddhsen Tripathi </span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 1 }}
                        className="text-gray-300 max-w-[300px] md:max-w-[500px] md:text-xl text-lg mb-6"
                    >
                        I’m a passionate full-stack developer with 22 months of experience creating and implementing dynamic web applications. I thrive on building seamless user experiences and enjoy tackling challenges across both front-end and back-end development.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="flex flex-row items-center gap-6 my-4 md:mb-0"
                    >

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.3)" }}
                            className="z-10 cursor-pointer font-bold text-gray-200 md:w-auto p-4 border border-purple-400 rounded-xl"
                        >
                            <Link to="contact">Connect with Me</Link>
                        </motion.button>


                        <div className="flex gap-6 flex-row text-4xl md:text-6xl text-purple-400 z-20">
                            <motion.a whileHover={{ scale: 1.2 }} href="https://github.com/Buddhsen-tripathi/" target="_blank">
                                <AiOutlineGithub />
                            </motion.a>

                            <motion.a whileHover={{ scale: 1.2 }} href="https://x.com/btr1pathi" target="_blank">
                                <AiOutlineX />
                            </motion.a>

                            <motion.a whileHover={{ scale: 1.2 }} href="https://www.linkedin.com/in/buddhsen-tripathi/" target="_blank">
                                <AiOutlineLinkedin />
                            </motion.a>
                        </div>
                    </motion.div>
                </motion.div>


                <motion.img
                    src={profilepic}
                    className="w-[300px] md:w-[420px]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                />
            </div>

            <div className="absolute inset-0 hidden md:block">
                <ShinyEffect left={0} top={0} size={1400} />
            </div>

        </div>
    )
}

export default Hero