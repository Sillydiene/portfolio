import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Rocket, Users } from 'lucide-react';

const stats = [
    { icon: Code2, value: '5+', label: "Années d'expérience" },
    { icon: Rocket, value: '50+', label: 'Projets réalisés' },
    { icon: Users, value: '30+', label: 'Clients satisfaits' },
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
                                Développeur Full Stack avec plus de 5 ans d'expérience, je suis spécialisé dans
                                la création d'applications web modernes et performantes. Mon approche allie
                                esthétique soignée et excellence technique.
                            </p>
                            <p>
                                Je travaille avec les technologies les plus récentes pour créer des solutions
                                sur mesure qui répondent parfaitement aux besoins de mes clients. Chaque projet
                                est une opportunité de repousser les limites du possible.
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