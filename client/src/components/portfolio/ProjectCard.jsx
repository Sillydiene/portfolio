import React, { useState } from 'react';
import { ArrowUpRight, Github, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectCard({ project }) {
    const images = project.images && project.images.length > 0
        ? project.images
        : [project.image];

    const [currentIndex, setCurrentIndex] = useState(0);

    const previousImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500">
            <div className="relative overflow-hidden bg-card">
                <img
                    src={images[currentIndex]}
                    alt={project.title}
                    className="w-full h-56 object-contain bg-card transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={previousImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition ${
                                        currentIndex === index
                                            ? 'bg-primary'
                                            : 'bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-inter bg-primary/10 text-primary border border-primary/20"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="font-playfair text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {project.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground font-inter leading-relaxed">
                    {project.description}
                </p>

                <div className="mt-5 flex items-center gap-4">
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-primary text-sm font-inter font-medium"
                    >
                        Voir le projet
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-inter font-medium transition-colors"
                    >
                        GitHub
                        <Github className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}