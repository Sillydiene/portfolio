import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';

const projects = [
    {
        title: 'E-Commerce Premium',
        description: "Plateforme e-commerce complète avec panier, paiement Stripe et tableau de bord d'administration avancé.",
        image: 'https://media.base44.com/images/public/69df06c90bf17d8b42d002b4/8d3a69fce_generated_afcb8360.png',
        tags: ['React', 'Node.js', 'Stripe', 'PostgreSQL'],
        category: 'Web',
    },
    {
        title: 'SaaS Project Manager',
        description: "Application de gestion de projets en temps réel avec tableaux Kanban, suivi du temps et collaboration d'équipe.",
        image: 'https://media.base44.com/images/public/69df06c90bf17d8b42d002b4/4adba659d_generated_2434fc75.png',
        tags: ['Next.js', 'TypeScript', 'Prisma', 'WebSocket'],
        category: 'Web',
    },
    {
        title: 'FinTech Mobile App',
        description: "Application bancaire mobile avec transactions sécurisées, analytics financiers et gestion de budget intelligent.",
        image: 'https://media.base44.com/images/public/69df06c90bf17d8b42d002b4/1f8a3d5f4_generated_10e200ec.png',
        tags: ['React Native', 'Python', 'AWS', 'AI/ML'],
        category: 'Mobile',
    },
    {
        title: 'Agence Créative',
        description: "Site vitrine ultra-moderne pour une agence créative avec animations immersives et design éditorial.",
        image: 'https://media.base44.com/images/public/69df06c90bf17d8b42d002b4/7cc6f8fa2_generated_0eb2b280.png',
        tags: ['React', 'Three.js', 'GSAP', 'Figma'],
        category: 'Design',
    },
];

const categories = ['Tous', 'Web', 'Mobile', 'Design'];

export default function ProjectsSection() {
    const [activeFilter, setActiveFilter] = useState('Tous');

    const filtered = activeFilter === 'Tous'
        ? projects
        : projects.filter((p) => p.category === activeFilter);

    return (
        <section id="projects" className="py-32 relative">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <span className="text-primary text-xs font-inter tracking-widest uppercase">Portfolio</span>
                    <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-4">
                        Projets <span className="text-primary">sélectionnés</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground font-inter max-w-xl mx-auto">
                        Une sélection de mes réalisations les plus récentes et les plus abouties.
                    </p>
                </motion.div>

                {/* Filter bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center justify-center gap-3 mb-12 flex-wrap"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-inter font-medium border transition-all duration-300 ${
                                activeFilter === cat
                                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                    : 'bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((project, idx) => (
                            <motion.div
                                key={project.title}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProjectCard project={project} index={idx} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}