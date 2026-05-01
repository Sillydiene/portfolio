import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="border-t border-border py-10">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex justify-between">

                    <h3>El Hadji Silly Diene</h3>

                    <div className="flex gap-4">
                        <a href="https://github.com/Sillydiene" target="_blank">
                            <FaGithub />
                        </a>

                        <a href="https://www.linkedin.com" target="_blank">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}