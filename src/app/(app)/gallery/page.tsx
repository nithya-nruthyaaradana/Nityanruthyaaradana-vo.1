
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FallbackImage } from '@/components/ui/fallback-image';
import { ImageModal } from '@/components/ui/image-modal';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  hint?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const heroVariants = {
  hidden: { 
    opacity: 0, 
    y: -30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export default function GalleryPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch images from firestore
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images: GalleryImage[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
      setGalleryImages(images.map(img => ({
          ...img,
          hint: img.alt // Use alt as hint for modal
      })));
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching gallery images: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImageIndex(null);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#8B0000] flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#8B0000]">
      {/* Hero Section */}
      <motion.section 
        className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Dance Gallery
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore the beauty and grace of classical dance through our curated collection of performances, training sessions, and cultural events.
          </motion.p>
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section 
        className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
              >
                <Card 
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border-0 shadow-lg"
                  onClick={() => handleImageClick(index)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <FallbackImage
                        src={image.src}
                        alt={image.alt}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500"
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div 
                        className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 text-white opacity-0 group-hover:opacity-100"
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Badge variant="secondary" className="mb-1 text-xs px-2 py-1">
                          {image.category}
                        </Badge>
                        <p className="text-xs font-medium leading-tight">{image.alt}</p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Image Modal */}
      {modalOpen && selectedImageIndex !== null && (
        <ImageModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          images={galleryImages}
          initialIndex={selectedImageIndex}
        />
      )}
    </div>
  );
}
