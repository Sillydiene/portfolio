import React from 'react';
import { motion } from 'framer-motion';

const skillCategories = [
    {
        title: 'Frontend',
        skills: [
            { name: 'React / Next.js', level: 95 },
            { name: 'TypeScript', level: 90 },
            { name: 'Tailwind CSS', level: 95 },
            { name: 'Framer Motion', level: 85 },
        ],
    },
    {
        title: 'Backend',
        skills: [
            { name: 'Node.js', level: 90 },
            { name: 'Python / Django', level: 85 },
            { name: 'PostgreSQL', level: 80 },
            { name: 'REST / GraphQL', level: 88 },
        ],
    },
    {
        title: 'Outils & DevOps',
        skills: [
            { name: 'Git / GitHub', level: 92 },
            { name: 'Docker', level: 78 },
            { name: 'AWS / Vercel', level: 82 },
            { name: 'CI/CD', level: 75 },
        ],
    },
    {
        title: 'Design',
        skills: [
            { name: 'Figma', level: 88 },
            { name: 'UI/UX Design', level: 85 },
            { name: 'Responsive Design', level: 95 },
            { name: 'Design Systems', level: 80 },
        ],
    },
];

function SkillBar({ name, level, delay }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-inter text-foreground">{name}</span>
                <span className="text-xs font-inter text-muted-foreground">{level}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: delay * 0.1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                />
            </div>
        </div>
    );
}

export default function SkillsSection() {
    return (
        <section id="skills" className="py-32 relative">
            {/* BG accent */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

            <div className="relative max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary text-xs font-inter tracking-widest uppercase">Compétences</span>
                    <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-4">
                        Technologies & <span className="text-primary">Expertise</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground font-inter max-w-xl mx-auto">
                        Un ensemble de compétences variées pour répondre à tous types de projets web.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {skillCategories.map((category, catIdx) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                            className="bg-card border border-border rounded-2xl p-8 hover:border-primary/20 transition-all duration-500"
                        >
                            <h3 className="font-playfair text-xl font-semibold text-foreground mb-6">{category.title}</h3>
                            <div className="space-y-5">
                                {category.skills.map((skill, skillIdx) => (
                                    <SkillBar
                                        key={skill.name}
                                        name={skill.name}
                                        level={skill.level}
                                        delay={catIdx + skillIdx}
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