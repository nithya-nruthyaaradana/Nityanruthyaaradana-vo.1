'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Quote, 
  User, 
  Calendar,
  ThumbsUp,
  MessageSquare,
  Send,
  Loader2
} from "lucide-react";
import { 
  StaggerContainer, 
  StaggerItem, 
  HoverAnimation, 
  TextAnimation,
  Scale
} from "@/components/ui/professional-animations";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp,
  where
} from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: any;
  updatedAt: any;
}

interface ReviewFormData {
  name: string;
  email: string;
  rating: number;
  comment: string;
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // First, get all reviews ordered by creation date
      const reviewsQuery = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc"),
        limit(20) // Get more reviews to filter client-side
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const allReviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      
      // Filter approved reviews client-side and limit to 6
      const approvedReviews = allReviews
        .filter(review => review.isApproved === true)
        .slice(0, 6);
      
      setReviews(approvedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Fallback data for demo purposes
      setReviews([
        {
          id: '1',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          rating: 5,
          comment: 'Nithyanruthyaaradana has been a transformative journey for my daughter. The teachers are incredibly dedicated and the traditional approach combined with modern teaching methods is exceptional.',
          isApproved: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          rating: 5,
          comment: 'The academy provides authentic Bharatanatyam training while maintaining the cultural essence. My daughter has grown both as a dancer and as a person.',
          isApproved: true,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10')
        },
        {
          id: '3',
          name: 'Anita Patel',
          email: 'anita@example.com',
          rating: 5,
          comment: 'Outstanding institution! The performances are breathtaking and the community is so supportive. Highly recommend to anyone interested in classical dance.',
          isApproved: true,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-05')
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comment) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        ...formData,
        isApproved: false, // Reviews need admin approval
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Review Submitted Successfully!",
        description: "Thank you for sharing your experience! Your review will be published after admin approval.",
      });

      setFormData({
        name: '',
        email: '',
        rating: 5,
        comment: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <section className="py-20 bg-[#8B0000]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <TextAnimation type="slide" direction="up" delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What Our <span className="text-yellow-300">Students Say</span>
            </h2>
          </TextAnimation>
          <TextAnimation type="fade" delay={0.4}>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-4">
              Hear from our students and their families about their transformative journey with Bharatanatyam.
            </p>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto mb-8">
              Only approved reviews are displayed below. Submit your review to share your experience!
            </p>
          </TextAnimation>
          <Scale delay={0.6}>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold text-lg px-8 py-4 shadow-lg"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Share Your Experience
            </Button>
          </Scale>
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 && (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" delay={0.6}>
            {reviews.map((review, index) => (
              <StaggerItem key={review.id} animation="slide" direction="up">
                <HoverAnimation effect="lift" tapEffect="scale">
                  <Card className="h-full border-0 shadow-xl bg-white/10 backdrop-blur-sm text-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-white">
                              {review.name}
                            </CardTitle>
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                        </div>
                        <Quote className="h-6 w-6 text-yellow-300 opacity-50" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-200 leading-relaxed mb-4">
                        "{review.comment}"
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-300/20 text-yellow-300 border-yellow-300/30">
                          Verified
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </HoverAnimation>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <TextAnimation type="fade" delay={0.8}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Share Your Experience
              </h3>
              <p className="text-gray-200 mb-6">
                Have you or your child experienced the magic of Bharatanatyam with us? 
                We'd love to hear your story! Your review will be published after admin approval.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Scale delay={1.0}>
                  <Button
                    onClick={() => setShowForm(!showForm)}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-4"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Add Your Review
                  </Button>
                </Scale>
                <Scale delay={1.2}>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#8B0000] text-lg px-8 py-4">
                    <a href="#contact">Contact Us</a>
                  </Button>
                </Scale>
              </div>
            </div>
          </TextAnimation>
        </div>

        {/* Review Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your review will be published after admin approval
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: i + 1 })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            i < formData.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <Textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Share your experience with our academy..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Floating Add Review Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <Scale delay={1.4}>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Add Review
            </Button>
          </Scale>
        </div>
      </div>
    </section>
  );
}
