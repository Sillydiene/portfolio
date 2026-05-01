import React from 'react';
import { motion } from 'framer-motion';

const skillCategories = [
    {
        title: 'FRONTEND',
        skills: [
            { name: 'HTML', level: 80 },
            { name: 'CSS', level: 75 },
            { name: 'JavaScript', level: 75 },
            { name: 'React', level: 80 },
        ],
    },
    {
        title: 'BACKEND',
        skills: [
            { name: 'C#', level: 80 },
            { name: 'Java', level: 68 },
            { name: 'PHP', level: 77 },
            { name: 'Node.js', level: 72 },
            { name: 'MySQL / SQL Server', level: 82 },
        ],
    },
    {
        title: 'OUTILS',
        skills: [
            { name: 'Git & GitHub', level: 90 },
            { name: 'Docker', level: 70 },
            { name: 'VS Code', level: 80 },
        ],
    },
];

function SkillBar({ name, level }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm md:text-base font-inter text-foreground">{name}</span>
                <span className="text-sm font-inter text-primary font-semibold">{level}%</span>
            </div>

            <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400"
                    style={{ width: `${level}%` }}
                />
            </div>
        </div>
    );
}

export default function SkillsSection() {
    return (
        <section id="skills" className="py-28 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

            <div className="relative max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <span className="text-primary text-xs font-inter tracking-[0.35em] uppercase">
                        Compétences
                    </span>

                    <h2 className="font-playfair text-4xl md:text-6xl font-bold mt-6 text-foreground">
                        Mon stack technique
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-card border border-border rounded-3xl px-8 py-9 min-h-[318px] shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
                        >
                            <h3 className="text-primary text-xl font-inter font-bold tracking-[0.25em] uppercase mb-10">
                                {category.title}
                            </h3>

                            <div className="space-y-9">
                                {category.skills.map((skill) => (
                                    <SkillBar
                                        key={skill.name}
                                        name={skill.name}
                                        level={skill.level}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}