import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-border py-10">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="text-left">
                        <h3 className="text-foreground font-inter font-semibold text-2xl">
                            El Hadji Silly Diene
                        </h3>
                        <p className="mt-2 text-muted-foreground font-inter text-base">
                            Étudiant en programmation DEC - React · Node.js
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-8">
                        <a
                            href="#about"
                            className="text-foreground font-inter text-base hover:text-primary transition-colors"
                        >
                            A propos
                        </a>
                        <a
                            href="#projects"
                            className="text-foreground font-inter text-base hover:text-primary transition-colors"
                        >
                            Projets
                        </a>
                        <a
                            href="#contact"
                            className="text-foreground font-inter text-base hover:text-primary transition-colors"
                        >
                            Contact
                        </a>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <a
                            href="https://github.com/Sillydiene"
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>

                        <a
                            href="https://www.linkedin.com/in/el-hadji-silly-di%C3%A8ne-0b02ba1bb/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground font-inter">
                        © 2026 Diene. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
}