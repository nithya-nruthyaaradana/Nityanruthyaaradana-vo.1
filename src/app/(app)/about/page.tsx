
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PageTransition,
  TextAnimation,
  StaggerContainer,
  StaggerItem,
  HoverAnimation,
  Scale
} from "@/components/ui/professional-animations";
import Link from "next/link";
import { ArrowRight, Award, Users, Theater, Heart, Star, type LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";

const iconMap: { [key: string]: LucideIcon } = {
  Heart,
  Users,
  Theater,
  Award,
  Star,
};

interface Philosophy {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface AboutPageContent {
  storyHeading: string;
  storyContent: string;
  storyImageUrl: string;
  founderHeading: string;
  founderName: string;
  founderBio: string;
  founderImageUrl: string;
}

export default function AboutPage() {
  const [pageContent, setPageContent] = useState<AboutPageContent | null>(null);
  const [philosophy, setPhilosophy] = useState<Philosophy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const pageDocRef = doc(db, "pages", "about");
        const pageDocSnap = await getDoc(pageDocRef);

        if (pageDocSnap.exists()) {
          setPageContent(pageDocSnap.data() as AboutPageContent);
        } else {
          setPageContent({
            storyHeading: "Our Story",
            storyContent: "Founded with a deep reverence for the ancient traditions of Bharatanatyam, our academy emerged from a vision to create a nurturing space where the divine art form could flourish. Our journey began with a simple yet profound mission: to preserve and promote the authentic essence of this classical dance form while making it accessible to passionate learners of all ages.",
            storyImageUrl: "https://placehold.co/600x400/8B0000/FFFFFF?text=Our+Story",
            founderHeading: "Our Founder & Principal Teacher",
            founderName: "Guru Smt. Priya Sharma",
            founderBio: "Guru Smt. Priya Sharma is a distinguished Bharatanatyam exponent and dedicated teacher with over two decades of experience in classical dance. A disciple of renowned gurus, she has dedicated her life to preserving and propagating the authentic traditions of Bharatanatyam.",
            founderImageUrl: "https://placehold.co/600x400/8B0000/FFFFFF?text=Our+Founder",
          });
        }

        const philosophyQuery = query(collection(db, "philosophy"), orderBy("order", "asc"));
        const philosophySnapshot = await getDocs(philosophyQuery);
        const philosophyData = philosophySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Philosophy));
        setPhilosophy(philosophyData.length > 0 ? philosophyData : [
          { id: '1', icon: 'Heart', title: 'Preservation', description: 'We are committed to preserving the authentic traditions and techniques of Bharatanatyam, ensuring that this ancient art form continues to thrive for future generations.' },
          { id: '2', icon: 'Users', title: 'Community', description: 'Our academy fosters a supportive community where students of all ages and backgrounds can learn, grow, and celebrate the rich cultural heritage of Indian classical dance.' },
          { id: '3', icon: 'Theater', title: 'Excellence', description: 'We strive for excellence in every aspect of training, from fundamental techniques to advanced performance skills, maintaining the highest standards of artistic integrity.' },
          { id: '4', icon: 'Award', title: 'Innovation', description: 'While honoring tradition, we embrace innovative teaching methods and contemporary approaches to make classical dance accessible and engaging for modern learners.' }
        ]);

      } catch (error) {
        console.error("Error fetching about page content:", error);
      }
      setIsLoading(false);
    };

    fetchContent();
  }, []);

  if (isLoading || !pageContent) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#8B0000]">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        {/* Page Header */}
        <section className="py-16 sm:py-20 text-center bg-[#8B0000]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TextAnimation type="slide" direction="up" delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                About <span className="text-yellow-300">Us</span>
              </h1>
            </TextAnimation>
            <TextAnimation type="fade" delay={0.4}>
              <p className="mt-4 sm:mt-6 max-w-3xl mx-auto text-lg text-gray-200 leading-relaxed">
                Discover the story behind our academy and our commitment to preserving the divine art of Bharatanatyam.
              </p>
            </TextAnimation>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 sm:py-20 bg-[#8B0000]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-20">
              <div>
                <TextAnimation type="slide" direction="left" delay={0.2}>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
                    <span className="text-yellow-300">{pageContent.storyHeading}</span>
                  </h2>
                </TextAnimation>
                <TextAnimation type="fade" delay={0.4}>
                  <p className="text-gray-200 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                    {pageContent.storyContent}
                  </p>
                </TextAnimation>
                <Scale delay={0.8}>
                  <Button asChild variant="outline" className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                    <Link href="/register">Join Our Academy</Link>
                  </Button>
                </Scale>
              </div>
              <div>
                <HoverAnimation effect="lift" tapEffect="scale">
                  <FallbackImage
                    src={pageContent.storyImageUrl}
                    alt="Founder of the dance academy teaching Bharatanatyam"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                </HoverAnimation>
              </div>
            </div>

            {/* Founder & Teacher Section */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-20">
              <div className="order-2 lg:order-1">
                <HoverAnimation effect="lift" tapEffect="scale">
                  <div className="relative">
                    <FallbackImage
                      src={pageContent.founderImageUrl}
                      alt="Founder and principal teacher of the academy in traditional Bharatanatyam costume"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg w-full h-auto"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                      <Star className="h-6 w-6" />
                    </div>
                  </div>
                </HoverAnimation>
              </div>
              <div className="order-1 lg:order-2">
                <TextAnimation type="slide" direction="right" delay={0.2}>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
                    <span className="text-yellow-300">{pageContent.founderHeading}</span>
                  </h2>
                </TextAnimation>
                <TextAnimation type="fade" delay={0.4}>
                  <p className="text-gray-200 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                    <strong>{pageContent.founderName}</strong> {pageContent.founderBio}
                  </p>
                </TextAnimation>

                <Scale delay={0.8}>
                  <Button asChild variant="outline" className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                    <Link href="/contact">Meet Our Teacher</Link>
                  </Button>
                </Scale>
              </div>
            </div>

            {/* Philosophy Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 mb-12 sm:mb-16">
              <div className="text-center mb-12 sm:mb-16">
                <TextAnimation type="slide" direction="up" delay={0.2}>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[#8B0000]">
                    Our <span className="text-yellow-600">Philosophy</span>
                  </h2>
                </TextAnimation>
                <TextAnimation type="fade" delay={0.4}>
                  <p className="text-gray-600 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed">
                    Our approach to teaching Bharatanatyam is rooted in four core principles that guide everything we do, 
                    ensuring authentic learning and cultural preservation.
                  </p>
                </TextAnimation>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10" delay={0.6}>
                {philosophy.map((item, index) => {
                  const Icon = iconMap[item.icon] || Heart;
                  return (
                    <StaggerItem key={item.id || index} animation="slide" direction="up">
                      <HoverAnimation effect="lift" tapEffect="scale">
                        <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Icon Container */}
                          <div className="relative z-10 flex items-start gap-4 sm:gap-6">
                            <div className="bg-gradient-to-br from-[#8B0000] to-[#6B0000] text-white rounded-2xl p-3 sm:p-4 shadow-lg flex-shrink-0">
                              <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1">
                              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[#8B0000] group-hover:text-[#6B0000] transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Decorative Element */}
                          <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </HoverAnimation>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
              
              {/* Bottom Decoration */}
              <div className="mt-12 sm:mt-16 text-center">
                <div className="inline-flex items-center gap-2 text-[#8B0000] text-sm font-medium">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-[#8B0000] to-yellow-600"></div>
                  <span>Guiding Principles</span>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-600 to-[#8B0000]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 sm:py-20 bg-[#8B0000]">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <TextAnimation type="slide" direction="up" delay={0.2}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Join Our Community</h2>
            </TextAnimation>
            <TextAnimation type="fade" delay={0.4}>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Ready to begin your journey with Bharatanatyam? Join our vibrant community of learners and discover the transformative power of classical dance.
              </p>
            </TextAnimation>
            <Scale delay={0.6}>
              <Button asChild size="lg" className="text-lg px-8 py-4 bg-white text-[#8B0000] hover:bg-gray-100">
                <Link href="/register">Start Your Journey <ArrowRight className="ml-2 h-5 w-5"/></Link>
              </Button>
            </Scale>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

    