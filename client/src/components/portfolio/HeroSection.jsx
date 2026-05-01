import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import imagePro from '../../assets/imagePro.png';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function HeroSection() {

    const { language } = useLanguage();

    const texts = {
        fr: {
            badge: "El Hadji Silly Diene | Recherche de stage",
            description: "Passionné par le code, déterminé à devenir expert en développement web moderne",
            btnProject: "Voir mes projets",
            btnCV: "Mon CV",
            scroll: "Scroll"
        },
        en: {
            badge: "El Hadji Silly Diene | Looking for internship",
            description: "Passionate about coding, determined to become an expert in modern web development",
            btnProject: "View my projects",
            btnCV: "My Resume",
            scroll: "Scroll"
        }
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-inter tracking-widest uppercase mb-8">
                        {texts[language].badge}
                    </span>
                </motion.div>

                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="flex justify-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-110" />
                        <img
                            src={imagePro}
                            alt="Profile"
                            className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-primary/30 shadow-2xl"
                        />
                    </div>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-10 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-inter leading-relaxed"
                >
                    {texts[language].description}
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="#projects"
                        className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition"
                    >
                        {texts[language].btnProject}
                    </a>

                    <a
                        href="/CV_DeveloppementWeb.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="px-8 py-3.5 border border-border rounded-full text-sm font-medium hover:border-primary/50 hover:text-primary transition"
                    >
                        {texts[language].btnCV}
                    </a>
                </motion.div>

                {/* Scroll */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-10"
                >
                    <a
                        href="#about"
                        className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition"
                    >
                        <span className="text-xs uppercase">
                            {texts[language].scroll}
                        </span>
                        <ArrowDown className="w-4 h-4" />
                    </a>
                </motion.div>

                {/* Social */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.75 }}
                    className="mt-8 flex items-center justify-center gap-4"
                >
                    <a
                        href="https://github.com/Sillydiene"
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border flex items-center justify-center hover:text-primary transition"
                    >
                        <FaGithub className="w-4 h-4" />
                    </a>

                    <a
                        href="https://www.linkedin.com/in/el-hadji-silly-di%C3%A8ne-0b02ba1bb/"
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border flex items-center justify-center hover:text-primary transition"
                    >
                        <FaLinkedin className="w-4 h-4" />
                    </a>
                </motion.div>

            </div>
        </section>
    );
}