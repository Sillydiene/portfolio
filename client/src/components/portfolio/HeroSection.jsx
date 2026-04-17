import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

export default function HeroSection() {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Gradient orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-inter tracking-widest uppercase mb-8">
            Développeur Full Stack
          </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                    className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
                >
                    Créateur
                    <br />
                    <span className="text-primary">d'expériences</span>
                    <br />
                    digitales
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className="mt-8 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-inter font-light leading-relaxed"
                >
                    Je conçois et développe des applications web modernes, performantes et élégantes
                    qui transforment des idées en produits digitaux remarquables.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
                    className="mt-10 flex items-center justify-center gap-5"
                >
                    <a
                        href="#projects"
                        className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-inter text-sm font-medium tracking-wide hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                    >
                        Voir mes projets
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-3.5 border border-border rounded-full font-inter text-sm font-medium tracking-wide text-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                        Me contacter
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-12 flex items-center justify-center gap-6"
                >
                    {[
                        { icon: Github, href: '#', label: 'GitHub' },
                        { icon: Linkedin, href: '#', label: 'LinkedIn' },
                        { icon: Mail, href: '#contact', label: 'Email' },
                    ].map(({ icon: Icon, href, label }) => (
                        <a
                            key={label}
                            href={href}
                            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                            aria-label={label}
                        >
                            <Icon className="w-4 h-4" />
                        </a>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <a href="#about" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <span className="text-xs font-inter tracking-widest uppercase">Scroll</span>
                        <ArrowDown className="w-4 h-4 animate-bounce" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}