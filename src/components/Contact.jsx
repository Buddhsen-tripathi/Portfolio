import React, { useRef } from "react";
import Reveal from "./Reveal";

const Contact = () => {
    const formRef = useRef(null);

    const handleSubmit = (e) => {
        
        setTimeout(() => {
            
            formRef.current.reset();
        }, 1000); 
    };

    return (
        <div className="flex justify-center items-center mt-12" id="contact">
            <Reveal>
                <form
                    ref={formRef}
                    action="https://openformstack.com/f/cm1zieo4j0004etb3ifjtayi2"
                    method="POST"
                    className="max-w-[1200px] w-full rounded-lg shadow-lg"
                    id="form"
                    onSubmit={handleSubmit}
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
                        required
                    />
                    <input
                        type="email"
                        id="email"
                        placeholder="Your Email ..."
                        name="email"
                        className="mb-4 w-full rounded-md border border-purple-400 py-2 px-4 text-black"
                        required
                    />
                    <textarea
                        name="textarea"
                        id="textarea"
                        cols="30"
                        rows="4"
                        placeholder="Your Message ..."
                        className="mb-4 w-full rounded-md border border-purple-400 py-2 px-4 text-black"
                        required
                    />
                    <button
                        type="submit"
                        className="button-bd"
                    >
                        Send Message
                    </button>
                </form>
            </Reveal>
        </div>
    );
};

export default Contact;