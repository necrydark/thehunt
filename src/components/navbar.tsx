// "use client"

// import { authClient } from "@/lib/auth-client";
// import { Menu, X } from "lucide-react";
// import { motion } from "motion/react";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { MotionLink } from "./motion-comps";
// import { Button } from "./ui/button";
// import UserButton from "./user-button";

// const links = [
//   { name: "Home", url: "/" },
//   { name: "Rules", url: "#rules" },
//   { name: "Assets", url: "#assets" },
//   { name: "Merch", url: "https://www.bonfire.com/store/borderlands-community-fundraising-team/" },
// ];

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//       const { 
//         data: session, 
//     } = authClient.useSession() 


//   useEffect(() => {
//     const handleScroll = () => {
//       const offset = window.scrollY;
//       setIsScrolled(offset > 50); // Change 50 to whatever threshold you want
//     };

//     window.addEventListener('scroll', handleScroll);
    
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleResize = () => {
//     if (window.innerWidth > 768) setIsMenuOpen(false);
//   };

//   useEffect(() => {
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   });


//   console.log("Session", session)


//   return (
//     <header className={`w-full fixed border-b-[1px] border-b-green-950/75 transition-all duration-300 z-50 ${isScrolled ? "bg-[#072607]" : "md:bg-transparent bg-[#072607]"}`}>
//       <nav className="max-w-[1280px] mx-auto flex justify-between items-center px-4 py-3"> 
//         {/* Logo */}
//         <Link href="/" className="flex items-center p-2 hover:opacity-75 transition">
//           <Image
//             priority
//             width={75}
//             height={50}
//             alt="Borderlands Community Fundraising Team Logo"
//             src="/bl-community.png"
//           />
//         </Link>

//         {/* Desktop Nav */}
//         <div className="hidden sm:flex items-center gap-4">
//           {links.map((link) => (
//             <Link
//               key={link.name}
//               href={link.url}
//               className="font-countach italic text-white hover:text-green-500 transition duration-300 px-3 py-2"
//             >
//               {link.name}
//             </Link>
//           ))}

//         {!session ? (
//           <Link
//           href={"/login"}
//           className="font-countach italic text-white hover:text-green-500 transition duration-300 px-3 py-2"
//         >
//           Login
//         </Link>
//         ) : (
//           <UserButton user={session?.user} />
//         )}

//           <Link href="https://tiltify.com/+borderlands-community/the-hunt-prepare-for-mayhem" target="_blank" rel="noopener noreferrer">
//             <Button className="bg-[#BBFE17] hover:bg-[#BBFE17]/75 cursor-pointer text-black">
//               Donate
//             </Button>
//           </Link>
//         </div>

//         {/* Mobile Toggle */}
//         <div className="sm:hidden flex items-center">
//           <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
//             {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <motion.div 
//         initial={{ height: 0}}
//         animate={{ height: 215}}
//         className="sm:hidden bg-[#072607] px-4 pb-4 space-y-4">
//           {links.map((link, idx) => (
//             <MotionLink
//             initial={{opacity: 0}}
//             animate={{opacity: 1}}
//             transition={{ duration: .2 * idx}}
//               key={link.name}
//               href={link.url}
//               onClick={() => setIsMenuOpen(false)}
//               className="block font-countach italic text-white hover:text-green-500 transition"
//             >
//               {link.name}
//             </MotionLink>
//           ))}
//           <MotionLink  
//              initial={{opacity: 0}}
//              animate={{opacity: 1}}
//              transition={{ duration: .8}}
//           href="#" onClick={() => setIsMenuOpen(false)}>
//             <Button className="w-full bg-[#BBFE17] hover:bg-[#BBFE17]/75 text-white">
//               Donate
//             </Button>
//           </MotionLink>
//         </motion.div>
//       )}
//     </header>
//   );
// };

// export default Navbar;


"use client"

import { Menu, X } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import UserButton from "./user-button"

const links = [
  { name: "Home", url: "/" },
  { name: "Rules", url: "#rules" },
  { name: "Assets", url: "#assets" },
  { name: "Leaderboard", url: "/leaderboard"},
  { name: "Merch", url: "https://www.bonfire.com/store/borderlands-community-fundraising-team/" },
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)


  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setIsScrolled(offset > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleResize = () => {
    if (window.innerWidth > 768) setIsMenuOpen(false)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  })

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
        <Link href="/" className="flex items-center p-2 hover:opacity-75 transition-all duration-300 hover:scale-105">
          <Image
            priority
            width={75}
            height={50}
            alt="Borderlands Community Fundraising Team Logo"
            src="/bl-community.png"
            className="drop-shadow-lg"
          />
        </Link>

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
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
  )
}
