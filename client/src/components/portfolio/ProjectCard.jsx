import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500"
        >
            {/* Image */}
            <div className="relative aspect-[3/2] overflow-hidden">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="p-7">
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

                <div className="mt-5 flex items-center gap-2 text-primary text-sm font-inter font-medium">
                    <span>Voir le projet</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
            </div>
        </motion.div>
    );
}