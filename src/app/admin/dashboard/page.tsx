
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, getDocs, where } from 'firebase/firestore';
import { Image as ImageIcon, MessageSquare, FileText, Settings, Star } from 'lucide-react';

// Prevent prerendering to avoid Firebase build-time errors
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [galleryCount, setGalleryCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [approvedReviewsCount, setApprovedReviewsCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchCounts = async () => {
      try {
        const gallerySnapshot = await getDocs(collection(db, "gallery"));
        setGalleryCount(gallerySnapshot.size);
        
        const reviewsSnapshot = await getDocs(collection(db, "reviews"));
        setReviewsCount(reviewsSnapshot.size);
        
        // Get all reviews and filter client-side to avoid index requirement
        const allReviewsSnapshot = await getDocs(collection(db, "reviews"));
        const approvedCount = allReviewsSnapshot.docs.filter(doc => 
          doc.data().isApproved === true
        ).length;
        setApprovedReviewsCount(approvedCount);
      } catch (error) {
        console.error("Error fetching counts: ", error);
        // Set fallback values for demo
        setGalleryCount(12);
        setReviewsCount(4);
        setApprovedReviewsCount(2);
      }
    };
    fetchCounts();

    const galleryQuery = query(collection(db, "gallery"));
    const reviewsQuery = query(collection(db, "reviews"));
    const unsubscribeGallery = onSnapshot(galleryQuery, (snapshot) => {
        setGalleryCount(snapshot.size);
    });
    
    const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
        setReviewsCount(snapshot.size);
        // Calculate approved count from all reviews
        const approvedCount = snapshot.docs.filter(doc => 
          doc.data().isApproved === true
        ).length;
        setApprovedReviewsCount(approvedCount);
    });

    return () => {
      unsubscribeGallery();
      unsubscribeReviews();
    };
  }, []);

  if (!isClient) {
    return null;
  }

  const statCards = [
    { title: "Gallery Images", value: galleryCount, icon: ImageIcon, change: "+12", changeColor: "text-green-500" },
    { title: "Total Reviews", value: reviewsCount, icon: Star, change: "+3", changeColor: "text-green-500" },
    { title: "Approved Reviews", value: approvedReviewsCount, icon: MessageSquare, change: "2 pending", changeColor: "text-orange-500" },
    { title: "Content Pages", value: 4, icon: FileText, change: "2 updated", changeColor: "text-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="bg-card hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className={`text-xs ${card.changeColor}`}>{card.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>Current content status across the site.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Gallery Images</span>
                <span className="text-sm text-muted-foreground">{galleryCount} images</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Features</span>
                <span className="text-sm text-muted-foreground">4 active</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">FAQs</span>
                <span className="text-sm text-muted-foreground">3 published</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Reviews</span>
                <span className="text-sm text-muted-foreground">{reviewsCount} total, {approvedReviewsCount} approved</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Site Activity</CardTitle>
            <CardDescription>Recent activity and updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Last Update</span>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">New Images</span>
                <span className="text-sm text-muted-foreground">3 added</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Content Changes</span>
                <span className="text-sm text-muted-foreground">5 updates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
