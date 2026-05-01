import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';

const projects = [
    {
        title: 'Projet ChatApp',
        description: "Application de discussion en temps réel permettant aux utilisateurs d’entrer un pseudo, de choisir une room et d’échanger instantanément dans différents espaces de conversation.",
        image: '/chatAppProject/imageChatApp.png',
        images: [
            '/chatAppProject/imageChatApp.png',
            '/chatAppProject/chatApp2.png'
        ],
        tags: ['React', 'Node.js', 'Socket.io', 'Chat en temps réel'],
        category: 'Web',
        liveUrl: 'https://chat-app-ten-olive.vercel.app/',
        githubUrl: 'https://github.com/Sillydiene/chat-app',
    },
    {
        title: 'Projet VidéoConférence',
        description: "Application de visioconférence permettant aux utilisateurs de créer ou rejoindre une salle, d’échanger en temps réel et de collaborer à distance dans une interface moderne et fluide.",
        image: '/videoconfProject/imageVideoConf.png',
        images: [
            '/videoconfProject/imageVideoConf.png',
            '/videoconfProject/videoconf2.png'
        ],
        tags: ['React', 'Node.js', 'WebRTC', 'Temps réel'],
        category: 'Web',
        liveUrl: 'https://videoconference-mini-lcgiscr58-sillydienes-projects.vercel.app/',
        githubUrl: 'https://github.com/Sillydiene/videoconferenceMini',
    },
    {
        title: 'Projet Barbershop',
        description: "Application de prise de rendez-vous pour salon de coiffure développée en SwiftUI, avec intégration d’API pour gérer les services, les réservations et une expérience utilisateur fluide sur mobile.",
        image: '/projetBarber/barbershopProject.png',
        images: [
            '/projetBarber/barbershopProject.png',
            '/projetBarber/barber1.png',
            '/projetBarber/barber2.png',
            '/projetBarber/barber3.png'
        ],
        tags: ['SwiftUI', 'API', 'iOS', 'Mobile'],
        category: 'Mobile',
        liveUrl: 'https://github.com/Sillydiene/Projet-swiftUI-API-application-prise-de-rendez-vous-Barber-shop',
        githubUrl: 'https://github.com/Sillydiene/Projet-swiftUI-API-application-prise-de-rendez-vous-Barber-shop',
    },
    {
        title: 'Gestion de Banque ADO.NET C#',
        description: "Application de gestion bancaire développée en C# avec ADO.NET et formulaires Windows, utilisant DataReader, DataSet et DataTable pour gérer les opérations bancaires, les clients et les comptes.",
        image: '/banqDB_C/banqDB_C_1.png',
        images: [
            '/banqDB_C/banqDB_C_1.png',
            '/banqDB_C/banqDB_C_2.png',
            '/banqDB_C/banqDB_C_3.png',
            '/banqDB_C/bandDB_C_4.png'
        ],
        tags: ['C#', 'ADO.NET', 'DataSet', 'Windows Forms'],
        category: 'Design',
        liveUrl: 'https://github.com/Sillydiene/Projet-C-ADO.NET-formulaires-gestion-Banque-Datareader-Dataset-Datatable',
        githubUrl: 'https://github.com/Sillydiene/Projet-C-ADO.NET-formulaires-gestion-Banque-Datareader-Dataset-Datatable',
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