import React from 'react';
import { MessageCircle } from 'lucide-react';

const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+10000000000';
const prefilledMessage = encodeURIComponent(
    "Bonjour, je vous contacte depuis votre portfolio."
);

export default function WhatsAppButton() {
    const href = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${prefilledMessage}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label="Contacter sur WhatsApp"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-105 transition-transform"
        >
            <MessageCircle className="w-6 h-6" />
        </a>
    );
}

