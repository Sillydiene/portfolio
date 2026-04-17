import { useState } from "react";

export default function ChatApp() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Salut. Pose ta question et je répondrai via ton backend OpenAI local.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const appendToLastAssistant = (delta) => {
        setMessages((prev) => {
            const next = [...prev];
            const lastIndex = next.length - 1;
            if (lastIndex < 0 || next[lastIndex].role !== "assistant") return prev;
            next[lastIndex] = { ...next[lastIndex], content: `${next[lastIndex].content}${delta}` };
            return next;
        });
    };

    const completeWithNonStreaming = async (message, history) => {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, history }),
        });

        const textBody = await response.text();
        let data = {};
        try {
            data = textBody ? JSON.parse(textBody) : {};
        } catch {
            data = {};
        }

        if (!response.ok) {
            const detail = data.error || textBody || `HTTP ${response.status}`;
            throw new Error(detail);
        }

        appendToLastAssistant(data.text || "(Réponse vide)");
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        const message = input.trim();
        if (!message || loading) return;

        setError("");
        const nextMessages = [...messages, { role: "user", content: message }];
        setMessages([...nextMessages, { role: "assistant", content: "" }]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, history: nextMessages }),
            });

            if (!response.ok || !response.body) {
                const textBody = await response.text().catch(() => "");
                let data = {};
                try {
                    data = textBody ? JSON.parse(textBody) : {};
                } catch {
                    data = {};
                }

                const reason = data.error || textBody || `HTTP ${response.status}`;
                const streamUnavailable =
                    response.status >= 500 ||
                    response.status === 404 ||
                    response.status === 502 ||
                    response.status === 503 ||
                    response.status === 504;

                if (streamUnavailable) {
                    await completeWithNonStreaming(message, nextMessages);
                    return;
                }

                throw new Error(reason);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const chunks = buffer.split("\n\n");
                buffer = chunks.pop() || "";

                for (const chunk of chunks) {
                    const lines = chunk
                        .split("\n")
                        .filter((line) => line.startsWith("data:"))
                        .map((line) => line.slice(5).trim())
                        .filter(Boolean);

                    for (const line of lines) {
                        const payload = JSON.parse(line);
                        if (payload.error) throw new Error(payload.error);
                        if (payload.delta) appendToLastAssistant(payload.delta);
                        if (payload.done) return;
                    }
                }
            }
        } catch (err) {
            appendToLastAssistant("\n\n[Erreur pendant le streaming]");
            setError(err.message || "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #101727 0%, #090d18 100%)",
                color: "#e5e7eb",
                padding: "32px 20px",
            }}
        >
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <header style={{ marginBottom: 20 }}>
                    <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 3vw, 2.3rem)" }}>Local Codex Chat UI</h1>
                    <p style={{ marginTop: 8, color: "#9ca3af" }}>
                        Portfolio: <a href="/" style={{ color: "#93c5fd" }}>/</a> | Chat:{" "}
                        <a href="/chat" style={{ color: "#93c5fd" }}>/chat</a>
                    </p>
                </header>

                <section
                    style={{
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.03)",
                        padding: 16,
                        minHeight: 420,
                        maxHeight: "65vh",
                        overflowY: "auto",
                    }}
                >
                    {messages.map((m, index) => (
                        <article
                            key={`${m.role}-${index}`}
                            style={{
                                marginBottom: 12,
                                display: "flex",
                                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "80%",
                                    borderRadius: 12,
                                    padding: "10px 12px",
                                    background:
                                        m.role === "user"
                                            ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                                            : "rgba(17,24,39,0.95)",
                                    border: "1px solid rgba(255,255,255,0.09)",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {m.content}
                            </div>
                        </article>
                    ))}
                    {loading && <p style={{ color: "#9ca3af" }}>L'assistant réfléchit...</p>}
                    {error && <p style={{ color: "#fca5a5" }}>Erreur: {error}</p>}
                </section>

                <form onSubmit={sendMessage} style={{ marginTop: 14, display: "flex", gap: 10 }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Écris ton message..."
                        style={{
                            flex: 1,
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.15)",
                            background: "rgba(255,255,255,0.02)",
                            color: "#fff",
                            padding: "12px 14px",
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            border: 0,
                            borderRadius: 10,
                            padding: "0 16px",
                            background: loading ? "#374151" : "#2563eb",
                            color: "#fff",
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        Envoyer
                    </button>
                </form>
            </div>
        </main>
    );
}
