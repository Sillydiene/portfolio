import React, { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

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

                {images.length > 1 && (
                    <>
                        <button onClick={previousImage}>
                            <ChevronLeft />
                        </button>

                        <button onClick={nextImage}>
                            <ChevronRight />
                        </button>
                    </>
                )}
            </div>

            <div className="p-6">
                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <div className="mt-5 flex items-center gap-4">
                    <a href={project.liveUrl} target="_blank">
                        Voir le projet <ArrowUpRight />
                    </a>

                    <a href={project.githubUrl} target="_blank">
                        GitHub <FaGithub />
                    </a>
                </div>
            </div>
        </div>
    );
}