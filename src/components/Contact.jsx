import React from "react"
import Reveal from "./Reveal"

const Contact = () => {
    return (
        <div className="flex justify-center items-center" id="contact">
            <Reveal>
                <form
                    action="https://getform.io/f/alljqxva"
                    method="POST"
                    className="max-w-[1200px] w-full rounded-lg shadow-lg"
                    id="form"
                >
                    <p className="text-gray-200 font-bold text-3xl text-center mb-8">
                        Contact
                    </p>
                    <input
                        type="text"
                        id="name"
                        placeholder="Your Name ..."
                        name="name"
                        className="mb-4 w-full rounded-md border border-purple-400 py-2 px-4 text-black"
                    />
                    <input
                        type="email"
                        id="email"
                        placeholder="Your Email ..."
                        name="email"
                        className="mb-4 w-full rounded-md border border-purple-400 py-2 px-4 text-black"
                    />
                    <textarea
                        name="textarea"
                        id="textarea"
                        cols="30"
                        rows="4"
                        placeholder="Your Message ..."
                        className="mb-4 w-full rounded-md border border-purple-400 py-2 px-4 text-black"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 rounded-md text-gray-200 font-semibold text-xl bg-purple-400 hover:bg-purple-400"
                    >
                        Send Message
                    </button>
                </form>
            </Reveal>
        </div>

    )
}

export default Contact