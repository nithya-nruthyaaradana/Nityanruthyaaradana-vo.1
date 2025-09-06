"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  Youtube, 
  MapPin, 
  Clock, 
  ArrowRight,
  Heart,
  Star,
  Award,
  Users,
  Sparkles,
  Music,
  Calendar
} from "lucide-react";
import { AnimatedLogo } from "@/components/animated-logo";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        } else {
          // Fallback settings
          setSettings({
            siteName: "Nithyanruthyaaradana",
            contactEmail: "info@nithyanruthyaaradana.art",
            contactPhone: "+91 123 456 7890",
            facebookUrl: "#",
            instagramUrl: "#",
            youtubeUrl: "#",
          });
        }
      } catch (error) {
        console.warn('Failed to fetch settings from Firebase, using fallback data:', error);
        setSettings({
          siteName: "Nithyanruthyaaradana",
          contactEmail: "info@nithyanruthyaaradana.art",
          contactPhone: "+91 123 456 7890",
          facebookUrl: "#",
          instagramUrl: "#",
          youtubeUrl: "#",
        });
      }
    };
    fetchSettings();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-[#8B0000] via-[#A00000] to-[#6B0000] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"></div>
      <div className="absolute top-4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-8 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-12 left-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse delay-500"></div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section */}
        <div className="container mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor" fillOpacity="0.2"></path>
                      <path d="M12 6C9.13 6 6.88 8.05 6.2 10.74C7.05 10.25 8.05 10 9.12 10C11.83 10 14.05 11.84 14.68 14.39C16.14 13.6 17.34 12.06 17.79 10.21C16.41 7.84 14.37 6 12 6Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-pulse">
                    <Sparkles className="w-3 h-3 text-white m-1" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Nithyanruthyaaradana
                  </h3>
                  <p className="text-yellow-200 text-sm font-medium flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Classical Dance Academy
                  </p>
                </div>
              </div>
              
              <p className="text-gray-200 leading-relaxed mb-8 max-w-lg text-base">
                Preserving and promoting the timeless art of Indian classical dance for future generations. 
                Join our vibrant community and discover the transformative power of Bharatanatyam.
              </p>

              {/* Social Media Links */}
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm font-medium">Follow Us:</span>
                <div className="flex gap-3">
                  <a 
                    href={settings?.facebookUrl || "#"} 
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors" />
                  </a>
                  <a 
                    href={settings?.instagramUrl || "#"} 
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors" />
                  </a>
                  <a 
                    href={settings?.youtubeUrl || "#"} 
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-yellow-300 flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Quick Links
              </h4>
              <ul className="space-y-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/register", label: "Admissions" },
                  { href: "/contact", label: "Contact" }
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-gray-200 hover:text-yellow-300 transition-colors flex items-center gap-2 group text-sm font-medium"
                    >
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-yellow-300 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Info
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Email</p>
                    <a 
                      href={`mailto:${settings?.contactEmail || 'info@nithyanruthyaaradana.art'}`}
                      className="text-gray-200 hover:text-yellow-300 transition-colors text-sm break-all"
                    >
                      {settings?.contactEmail || 'info@nithyanruthyaaradana.art'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Phone</p>
                    <a 
                      href={`tel:${settings?.contactPhone || '+91 123 456 7890'}`}
                      className="text-gray-200 hover:text-yellow-300 transition-colors text-sm"
                    >
                      {settings?.contactPhone || '+91 123 456 7890'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Address</p>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      123 Dance Street,<br />
                      Cultural District,<br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Hours</p>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      Mon-Sat: 9:00 AM - 8:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">Our Journey in Numbers</h3>
              <p className="text-gray-300">Celebrating excellence in classical dance education</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">500+</div>
                <div className="text-gray-300 text-sm font-medium">Students</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">25+</div>
                <div className="text-gray-300 text-sm font-medium">Years Experience</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">100+</div>
                <div className="text-gray-300 text-sm font-medium">Performances</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">98%</div>
                <div className="text-gray-300 text-sm font-medium">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10 bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-yellow-300 mb-2">Stay Updated</h3>
              <p className="text-gray-300 text-sm mb-4">Get the latest news about our performances and events</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-300 text-sm">
                  © {currentYear} Nithyanruthyaaradana. All rights reserved.
                </p>
                <p className="text-gray-400 text-xs mt-1 flex items-center justify-center md:justify-start gap-1">
                  <Calendar className="w-3 h-3" />
                  Preserving the art of classical dance for future generations
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-300 text-sm">
                  Crafted with <Heart className="w-4 h-4 inline text-red-400 mx-1" /> by{" "}
                  <Link
                    href="https://anandverse.space"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors underline decoration-yellow-300/50 hover:decoration-yellow-200"
                  >
                    AnandVerse Web Services
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}