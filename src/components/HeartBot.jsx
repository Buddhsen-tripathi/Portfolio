import React, { useState } from "react";

const HeartBot = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi. How are you feeling today?" },
    ]);
    const [userMessage, setUserMessage] = useState("");

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userMessage.trim()) return;

        const newMessages = [...messages, { sender: "user", text: userMessage }];
        setMessages(newMessages);

        try {
            const response = await fetch("https://heartbotbe-production.up.railway.app/api/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Include cookies for session management
                body: JSON.stringify({ message: userMessage }),
            });
            const updatedConversation = await response.json();
            setMessages(updatedConversation);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setUserMessage(""); // Clear input
    };

    return (
        <div className="max-w-[1000px] mx-auto p-6 mt-24 bd-page">
            <div
                style={{
                    width: "400px",
                    height: "650px",
                    border: "16px solid #333",
                    borderRadius: "40px",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        background: "#e8eaf6",
                        borderRadius: "24px 24px 0 0",
                    }}
                >
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                maxWidth: "70%",
                                padding: "10px 15px",
                                borderRadius: "20px",
                                fontSize: "14px",
                                lineHeight: "1.4",
                                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                backgroundColor: msg.sender === "user" ? "#f5f5f5" : "#6200ea",
                                color: msg.sender === "user" ? "#333" : "#fff",
                            }}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
                <form
                    style={{
                        display: "flex",
                        padding: "10px",
                        background: "#f4f6f8",
                        borderRadius: "0 0 24px 24px",
                    }}
                    onSubmit={handleSendMessage}
                >
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "10px",
                            border: "2px solid #ccc",
                            borderRadius: "20px",
                            outline: "none",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            marginLeft: "10px",
                            padding: "10px 20px",
                            border: "none",
                            backgroundColor: "#6200ea",
                            color: "#fff",
                            borderRadius: "20px",
                            cursor: "pointer",
                        }}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HeartBot;