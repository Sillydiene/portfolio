import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Rocket, Users } from 'lucide-react';

const stats = [
    { icon: Code2, value: '3e année', label: "Parcours en informatique" },
    { icon: Rocket, value: 'Objectif', label: 'Spécialisation en développement web moderne' },
    { icon: Users, value: 'Plusieurs projets', label: 'Video Conference, ChatApp, Gestion de Banque' },
    { icon: Palette, value: '100%', label: 'Passion & créativité' },
];

export default function AboutSection() {
    return (
        <section id="about" className="py-32 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="text-primary text-xs font-inter tracking-widest uppercase">À propos</span>
                        <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-4 leading-tight">
                            Passionné par le
                            <br />
                            <span className="text-primary">design & le code</span>
                        </h2>
                        <div className="mt-8 space-y-5 text-muted-foreground font-inter leading-relaxed">
                            <p>
                                Étudiant en 3e année de DEC en informatique, je me spécialise en développement web frontend et backend (React, JavaScript, Node.js, C#, Java, PHP, SQL).

                                Actuellement à la recherche d’un stage en développement web pour appliquer mes compétences et évoluer dans un environnement professionnel.                            </p>
                            <p>
                                J’aime transformer des idées en projets concrets, tout en améliorant continuellement mes compétences techniques et ma compréhension des bonnes pratiques de développement.
                            </p>
                        </div>
                        <a
                            href="#contact"
                            className="inline-block mt-8 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-inter text-sm font-medium tracking-wide hover:bg-primary/90 transition-all duration-300"
                        >
                            Travaillons ensemble
                        </a>
                    </motion.div>

                    {/* Right - Stats grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="grid grid-cols-2 gap-5"
                    >
                        {stats.map(({ icon: Icon, value, label }, idx) => (
                            <div
                                key={label}
                                className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="font-playfair text-3xl font-bold text-foreground">{value}</div>
                                <div className="text-muted-foreground text-sm font-inter mt-1">{label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}