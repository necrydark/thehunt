import { ExternalLink, Github, Heart, Twitch } from "lucide-react";
import Link from "next/link";
import { FaDiscord, FaX, FaYoutube } from "react-icons/fa6";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="w-full border-t border-green-900/30 bg-black backdrop-blur-sm py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Copyright */}
          <div className="space-y-2">
            <p className="text-white font-semibold">&copy; The Hunt 2025</p>
            <p className="text-gray-400 text-sm">
              Made with <Heart className="inline w-4 h-4 text-red-500 mx-1" />{" "}
              for the community
            </p>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <h3 className="text-green-400 font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col space-y-1">
              <Link
                href="#rules"
                className="text-gray-300 hover:text-green-400 transition-colors text-sm"
              >
                Rules & Guidelines
              </Link>
              <Link
                href="#assets"
                className="text-gray-300 hover:text-green-400 transition-colors text-sm"
              >
                Stream Assets
              </Link>
              <Link
                href="https://tiltify.com/+borderlands-community/the-hunt-prepare-for-mayhem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors text-sm inline-flex justify-center sm:justify-start items-center gap-1"
              >
                Donate to St. Jude <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="space-y-2">
            <h3 className="text-green-400 font-semibold mb-3">Disclaimer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We are not affiliated with Gearbox Software or 2K Games. This is a
              community-driven charity event.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-green-900/20 text-center items-center sm:flex-row flex-col gap-4 flex justify-between">
          <p className="text-gray-500 text-xs">
            Supporting St. Jude Children&apos;s Research Hospital through gaming
          </p>
          <div className="flex gap-2">
            <Link href={"https://discord.com/invite/aGgVEzvg"} target="_blank">
              <Button className="bg-primary-green cursor-pointer hover:bg-primary-green/75">
                <FaDiscord size={16} className="text-black" />
              </Button>
            </Link>
            <Link href={"https://x.com/Ki11ersix"} target="_blank">
              <Button className="bg-primary-green cursor-pointer hover:bg-primary-green/75">
                <FaX size={16} className="text-black" />
              </Button>
            </Link>
            <Link href={"https://x.com/necrydark"} target="_blank">
              <Button className="bg-primary-green cursor-pointer hover:bg-primary-green/75">
                <FaX size={16} className="text-black" />
              </Button>
            </Link>
            <Link href={"https://www.youtube.com/ki11ersix"} target="_blank">
              <Button className="bg-primary-green cursor-pointer hover:bg-primary-green/75">
                <FaYoutube size={16} className="text-black" />
              </Button>
            </Link>
            <Link href={"https://www.twitch.tv/ki11ersix"} target="_blank">
              <Button className="bg-primary-green cursor-pointer hover:bg-primary-green/75">
                <Twitch size={16} className="text-black" />
              </Button>
            </Link>
            <Link href={"https://github.com/necrydark/thehunt"} target="_blank">
              <Button className="bg-primary-green cursor-pointer hover:bg-primary-green/75">
                <Github size={16} className="text-black" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
