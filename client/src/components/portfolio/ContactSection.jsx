import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';

const contactInfo = [
    { icon: Mail, label: 'EMAIL', value: 'Sillydiene@gmail.com' },
    { icon: Phone, label: 'TÉLÉPHONE', value: '579-421-2630' },
    { icon: MapPin, label: 'LOCALISATION', value: 'Montreal, Quebec' },
];

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setStatus('error');
            setErrorMessage('Veuillez remplir tous les champs.');
            return;
        }

        console.log('SERVICE_ID =', SERVICE_ID);
        console.log('TEMPLATE_ID =', TEMPLATE_ID);
        console.log('PUBLIC_KEY =', PUBLIC_KEY);

        try {
            setStatus('sending');
            setErrorMessage('');

            const result = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                },
                PUBLIC_KEY
            );

            console.log('EMAILJS SUCCESS =', result);

            setStatus('success');
            setFormData({
                name: '',
                email: '',
                message: '',
            });
        } catch (error) {
            console.error('EMAILJS ERROR =', error);
            setStatus('error');
            setErrorMessage("L'envoi du message a échoué. Réessayez.");
        }
    };

    return (
        <section id="contact" className="py-28 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

            <div className="relative max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground">
                        Travaillons ensemble
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-10"
                    >
                        <p className="text-muted-foreground font-inter text-lg leading-10 max-w-md">
                            Vous avez un projet ou une opportunité en développement web ?
                            N’hésitez pas à me contacter. Je suis actuellement étudiant en
                            3e année de DEC en informatique et ouvert aux opportunités pour
                            développer mes compétences en développement web moderne.
                        </p>

                        <div className="space-y-8">
                            {contactInfo.map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl border border-primary/20 bg-secondary/40 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>

                                    <div>
                                        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-inter mb-1">
                                            {label}
                                        </p>
                                        <p className="text-foreground font-inter text-base">
                                            {value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <input
                            type="text"
                            placeholder="Votre nom"
                            value={formData.name}
                            onChange={handleChange('name')}
                            className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40"
                        />

                        <input
                            type="email"
                            placeholder="Votre email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            className="w-full h-14 px-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40"
                        />

                        <textarea
                            placeholder="Votre message"
                            rows={7}
                            value={formData.message}
                            onChange={handleChange('message')}
                            className="w-full px-5 py-5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/40"
                        />

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-inter font-semibold text-lg hover:opacity-90 transition disabled:opacity-60"
                        >
                            {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
                        </button>

                        {status === 'success' && (
                            <p className="text-sm text-green-400 font-inter">
                                Message envoyé avec succès.
                            </p>
                        )}

                        {status === 'error' && (
                            <p className="text-sm text-red-400 font-inter">
                                {errorMessage}
                            </p>
                        )}
                    </motion.form>
                </div>
            </div>
        </section>
    );
}