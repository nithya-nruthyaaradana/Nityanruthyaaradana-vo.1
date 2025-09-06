
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PageTransition,
  TextAnimation,
  StaggerContainer,
  StaggerItem,
  HoverAnimation,
} from "@/components/ui/professional-animations";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Prevent prerendering to avoid Firebase build-time errors
export const dynamic = 'force-dynamic';

interface SiteSettings {
  contactEmail: string;
  contactPhone: string;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      } else {
        // Fallback settings
        setSettings({
          contactEmail: "info@nithyanruthyaaradana.art",
          contactPhone: "+91 123 456 7890",
        });
      }
    };
    fetchSettings();
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: settings?.contactEmail || "Loading...",
      link: `mailto:${settings?.contactEmail}`
    },
    {
      icon: Phone,
      title: "Phone",
      content: settings?.contactPhone || "Loading...",
      link: `tel:${settings?.contactPhone}`
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Dance Street, Cultural District, Chennai, Tamil Nadu 600001"
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Monday - Saturday: 8:00 AM - 8:00 PM"
    }
  ];

  return (
    <PageTransition>
      <div>
        {/* Page Header */}
        <section className="py-10 sm:py-12 md:py-16 text-center bg-[#8B0000]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TextAnimation type="slide" direction="up" delay={0.2}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-white">Contact Us</h1>
            </TextAnimation>
            <TextAnimation type="fade" delay={0.4}>
              <p className="mt-3 sm:mt-4 md:mt-6 max-w-2xl mx-auto text-gray-200 text-sm sm:text-base leading-relaxed px-2">
                Get in touch with us to learn more about our programs or to schedule a visit to our academy.
              </p>
            </TextAnimation>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#8B0000]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Contact Form */}
              <div>
                <TextAnimation type="slide" direction="left" delay={0.2}>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-headline mb-3 sm:mb-4 md:mb-6 text-white">Send us a Message</h2>
                </TextAnimation>
                <TextAnimation type="fade" delay={0.4}>
                  <p className="text-gray-200 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base leading-relaxed">
                    Have questions about our programs or want to schedule a visit? Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </TextAnimation>
                <HoverAnimation effect="lift" tapEffect="scale">
                  <Card className="bg-card/80">
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <ContactForm />
                    </CardContent>
                  </Card>
                </HoverAnimation>
              </div>

              {/* Contact Information */}
              <div>
                <TextAnimation type="slide" direction="right" delay={0.2}>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-headline mb-3 sm:mb-4 md:mb-6 text-white">Get in Touch</h2>
                </TextAnimation>
                <TextAnimation type="fade" delay={0.4}>
                  <p className="text-gray-200 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base leading-relaxed">
                    We're here to help you on your dance journey. Reach out to us through any of the following channels.
                  </p>
                </TextAnimation>

                <StaggerContainer className="space-y-3 sm:space-y-4 md:space-y-6" delay={0.6}>
                  {contactInfo.map((info, index) => (
                    <StaggerItem key={index} animation="slide" direction="up">
                      <HoverAnimation effect="lift" tapEffect="scale">
                        <Card className="bg-card/80">
                          <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="bg-[#8B0000] text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center flex-shrink-0">
                                <info.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 text-white">{info.title}</h3>
                                {info.link ? (
                                  <a 
                                    href={info.link} 
                                    className="text-gray-200 hover:text-yellow-300 transition-colors text-xs sm:text-sm md:text-base leading-relaxed break-all"
                                  >
                                    {info.content}
                                  </a>
                                ) : (
                                  <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed">{info.content}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </HoverAnimation>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
