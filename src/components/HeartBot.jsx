import React, { useState } from "react";

const HeartBot = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi. How are you feeling today?" },
    ]);
    const [userMessage, setUserMessage] = useState("");
    const [mode, setMode] = useState("interactive");
    const [rantMessages, setRantMessages] = useState([]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!userMessage.trim()) return;

        const newMessages = [...messages, { sender: "user", text: userMessage }];
        setMessages(newMessages);

        if (mode === "rant") {
            // Store messages in a separate list for Rant Mode
            setRantMessages([...rantMessages, userMessage]);
        } else {
            // Call API for Interactive Mode
            fetch("https://heartbotbe-production.up.railway.app/api/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Include cookies for session management
                body: JSON.stringify({ message: userMessage }),
            })
                .then((response) => response.json())
                .then((updatedConversation) => setMessages(updatedConversation))
                .catch((error) => console.error("Error sending message:", error));
        }

        setUserMessage(""); // Clear input
    };

    const toggleMode = () => {
        const newMode = mode === "interactive" ? "rant" : "interactive";

        if (newMode === "interactive" && rantMessages.length > 0) {
            // Respond to all rant messages when switching back
            const combinedRant = rantMessages.join(" ");
            fetch("https://heartbotbe-production.up.railway.app:80/api/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ message: combinedRant }),
            })
                .then((response) => response.json())
                .then((updatedConversation) => {
                    setMessages([...messages, ...updatedConversation]);
                    setRantMessages([]); // Clear rant messages after processing
                })
                .catch((error) => console.error("Error processing rant messages:", error));
        }

        setMode(newMode);
    };

    return (
        <div className="flex justify-center items-center min-h-screen mt-12 bg-gray-100">
            <div
                style={{
                    width: "400px",
                    height: "700px",
                    border: "2px solid #333",
                    borderRadius: "24px",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                }}
            >
                {/* Header with Toggle Button */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 20px",
                        backgroundColor: "#6200ea",
                        color: "#fff",
                        borderRadius: "24px 24px 0 0",
                    }}
                >
                    <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>HeartBot</h2>
                    <button
                        onClick={toggleMode}
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "#fff",
                            color: "#6200ea",
                            borderRadius: "12px",
                            fontSize: "12px",
                            cursor: "pointer",
                            border: "none",
                        }}
                    >
                        {mode === "interactive" ? "Switch to Rant Mode" : "Switch to Interactive Mode"}
                    </button>
                </div>

                {/* Chat Messages */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        background: "#f9f9f9",
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
                                backgroundColor: msg.sender === "user" ? "#e0e0e0" : "#6200ea",
                                color: msg.sender === "user" ? "#333" : "#fff",
                            }}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input Field */}
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