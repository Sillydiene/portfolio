import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';

const navLinks = {
    fr: [
        { label: 'Accueil', href: '#hero' },
        { label: 'À propos', href: '#about' },
        { label: 'Compétences', href: '#skills' },
        { label: 'Projets', href: '#projects' },
        { label: 'Contact', href: '#contact' },
    ],
    en: [
        { label: 'Home', href: '#hero' },
        { label: 'About', href: '#about' },
        { label: 'Skills', href: '#skills' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' },
    ],
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);

    const { language, toggleLanguage } = useLanguage();

    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-inter ${
            scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-4' : 'py-6'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <a href="#hero" className="font-playfair text-2xl font-bold text-primary">
                    Portfolio<span className="text-foreground">.</span>
                </a>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-8 mr-4">
                    {navLinks[language].map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 tracking-wide uppercase"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {/* Language */}
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 rounded-full border border-primary/30 text-primary text-sm hover:bg-primary/10 transition"
                    >
                        {language === 'fr' ? 'EN' : 'FR'}
                    </button>

                    {/* Theme */}
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {/* Mobile menu */}
                    <button
                        className="md:hidden text-foreground"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
                    >
                        <div className="px-6 py-6 flex flex-col gap-4">
                            {navLinks[language].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}