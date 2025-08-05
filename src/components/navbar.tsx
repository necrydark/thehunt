"use client"

import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MotionLink } from "./motion-comps";
import { Button } from "./ui/button";

const links = [
  { name: "Home", url: "/" },
  { name: "Rules", url: "#rules" },
  { name: "Assets", url: "#assets" },
  { name: "Merch", url: "https://www.bonfire.com/store/borderlands-community-fundraising-team/" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50); // Change 50 to whatever threshold you want
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleResize = () => {
    if (window.innerWidth > 768) setIsMenuOpen(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });



  return (
    <header className={`w-full fixed border-b-[1px] border-b-green-950/75 transition-all duration-300 z-50 ${isScrolled ? "bg-[#072607]" : "md:bg-transparent bg-[#072607]"}`}>
      <nav className="max-w-[1280px] mx-auto flex justify-between items-center px-4 py-3"> 
        {/* Logo */}
        <Link href="/" className="flex items-center p-2 hover:opacity-75 transition">
          <Image
            priority
            width={75}
            height={50}
            alt="Borderlands Community Fundraising Team Logo"
            src="/bl-community.png"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className="font-countach italic text-white hover:text-green-500 transition duration-300 px-3 py-2"
            >
              {link.name}
            </Link>
          ))}
          <Link href="#">
            <Button className="bg-[#BBFE17] hover:bg-[#BBFE17]/75 cursor-pointer text-black">
              Donate
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="sm:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
        initial={{ height: 0}}
        animate={{ height: 215}}
        className="sm:hidden bg-[#072607] px-4 pb-4 space-y-4">
          {links.map((link, idx) => (
            <MotionLink
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{ duration: .2 * idx}}
              key={link.name}
              href={link.url}
              onClick={() => setIsMenuOpen(false)}
              className="block font-countach italic text-white hover:text-green-500 transition"
            >
              {link.name}
            </MotionLink>
          ))}
          <MotionLink  
             initial={{opacity: 0}}
             animate={{opacity: 1}}
             transition={{ duration: .8}}
          href="#" onClick={() => setIsMenuOpen(false)}>
            <Button className="w-full bg-[#BBFE17] hover:bg-[#BBFE17]/75 text-white">
              Donate
            </Button>
          </MotionLink>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
