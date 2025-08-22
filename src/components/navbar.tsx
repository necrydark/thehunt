"use client";

import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import UserButton from "./user-button";

const links = [
  { name: "Home", url: "/" },
  { name: "Rules", url: "https://thehunt-virid.vercel.app/#rules" },
  { name: "Assets", url: "https://thehunt-virid.vercel.app/#assets" },
  { name: "Leaderboard", url: "/leaderboard" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleResize = () => {
    if (window.innerWidth > 768) setIsMenuOpen(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <header
      className={`w-full fixed transition-all duration-300 z-50 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md border-b border-green-900/30 shadow-lg"
          : "md:bg-transparent bg-black/60 md:backdrop-blur-none backdrop-blur-md border-b border-green-900/20"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo with hover effect */}
        <div className="flex gap-2 items-center">
          <Link
            href="/"
            className="flex items-center p-2 hover:opacity-75 transition-all duration-300 hover:scale-105"
          >
            <Image
              priority
              width={75}
              height={50}
              alt="Borderlands Community Fundraising Team Logo"
              src="/bl-community.png"
              className="drop-shadow-lg"
            />
          </Link>
          <Badge className="bg-primary-green text-black">Beta</Badge>
        </div>

        {/* Desktop Nav with improved styling */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className="font-semibold text-white hover:text-green-400 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-green-500/10 relative group"
            >
              {link.name}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </Link>
          ))}
          <Link
            href={
              "https://www.bonfire.com/store/borderlands-community-fundraising-team/"
            }
            target="_blank"
            className="font-semibold text-white hover:text-green-400 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-green-500/10 relative group"
          >
            Merch
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          </Link>
          <UserButton />

          <Link
            href="https://tiltify.com/+borderlands-community/the-hunt-prepare-for-mayhem"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25">
              Donate
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle with improved styling */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 rounded-lg hover:bg-green-500/10 transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu with enhanced styling */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-black/60 backdrop-blur-md border-t border-green-900/30 px-4 py-6 space-y-2"
        >
          {links.map((link, idx) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.1 }}
            >
              <Link
                href={link.url}
                onClick={() => setIsMenuOpen(false)}
                className="block font-semibold text-white hover:text-green-400 transition-all duration-300 px-4 py-3 rounded-lg hover:bg-green-500/10"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: links.length * 0.1 }}
          >
            <Link
              href={
                "https://www.bonfire.com/store/borderlands-community-fundraising-team/"
              }
              target="_blank"
              className="block font-semibold text-white hover:text-green-400 transition-all duration-300 px-4 py-3 rounded-lg hover:bg-green-500/10"
            >
              Merch
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: links.length * 0.1 }}
            className="px-4 py-3"
          >
            <UserButton />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: links.length * 0.2 }}
          >
            <Link
              href="https://tiltify.com/+borderlands-community/the-hunt-prepare-for-mayhem"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition-all duration-300">
                Donate
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </header>
  );
};
