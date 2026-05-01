import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '15140000000';

export default function LiveChat() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');

    const sendToWhatsApp = () => {
        const message = input.trim();

        if (!message) return;

        const fullMessage =
            `Bonjour, je vous contacte depuis votre portfolio.%0A%0A` +
            `Message : ${encodeURIComponent(message)}%0A%0A` +
            `Page : ${encodeURIComponent(window.location.href)}`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${fullMessage}`;

        window.open(whatsappUrl, '_blank');
        setInput('');
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendToWhatsApp();
        }
    };

    return (
        <div className="fixed bottom-6 right-24 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-primary px-4 py-3 flex items-center justify-between">
                            <div>
                                <p className="text-primary-foreground font-semibold text-sm">
                                    Chat WhatsApp
                                </p>
                                <p className="text-primary-foreground/70 text-xs">
                                    Réponse via WhatsApp
                                </p>
                            </div>

                            <button onClick={() => setOpen(false)}>
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        <div className="h-72 overflow-y-auto p-4 bg-background flex items-center justify-center">
                            <p className="text-center text-sm text-muted-foreground">
                                Écrivez votre message, puis cliquez sur envoyer.
                                <br />
                                Vous serez redirigé vers WhatsApp.
                            </p>
                        </div>

                        <div className="border-t p-3 flex gap-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Votre message..."
                                rows={1}
                                className="flex-1 px-3 py-2 rounded-xl bg-secondary text-sm resize-none outline-none"
                            />

                            <button
                                onClick={sendToWhatsApp}
                                className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setOpen(!open)}
                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg"
            >
                {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
}