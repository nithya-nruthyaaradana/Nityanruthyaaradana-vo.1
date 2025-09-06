'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  User, 
  Calendar,
  Check,
  X,
  Eye,
  Search,
  Filter,
  Loader2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  where,
  limit
} from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Review } from "../review-section";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc")
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
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
          isApproved: false,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-05')
        },
        {
          id: '4',
          name: 'Suresh Reddy',
          email: 'suresh@example.com',
          rating: 4,
          comment: 'Great academy with excellent teachers. The facilities are good and the curriculum is well-structured.',
          isApproved: false,
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-03')
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "reviews", reviewId), {
        isApproved: true,
        updatedAt: new Date()
      });
      
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, isApproved: true, updatedAt: new Date() }
          : review
      ));
      
      toast({
        title: "Review Approved",
        description: "The review has been approved and will now be visible on the website.",
      });
    } catch (error) {
      console.error("Error approving review:", error);
      toast({
        title: "Error",
        description: "Failed to approve review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (reviewId: string) => {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "reviews", reviewId), {
        isApproved: false,
        updatedAt: new Date()
      });
      
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, isApproved: false, updatedAt: new Date() }
          : review
      ));
      
      toast({
        title: "Review Rejected",
        description: "The review has been rejected and will not be visible on the website.",
      });
    } catch (error) {
      console.error("Error rejecting review:", error);
      toast({
        title: "Error",
        description: "Failed to reject review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    setIsUpdating(true);
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews(reviews.filter(review => review.id !== reviewId));
      
      toast({
        title: "Review Deleted",
        description: "The review has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && review.isApproved) ||
                         (statusFilter === 'pending' && !review.isApproved);
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.isApproved).length,
    pending: reviews.filter(r => !r.isApproved).length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0'
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <ThumbsDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reviews Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.name}</div>
                        <div className="text-sm text-muted-foreground">{review.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({review.rating})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {review.comment}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={review.isApproved ? "default" : "secondary"}
                        className={review.isApproved ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReview(review)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Review Details</DialogTitle>
                              <DialogDescription>
                                Full review content and details
                              </DialogDescription>
                            </DialogHeader>
                            {selectedReview && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-semibold">{selectedReview.name}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedReview.email}</p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {renderStars(selectedReview.rating)}
                                    <span className="text-sm text-muted-foreground ml-1">
                                      ({selectedReview.rating}/5)
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Review:</h4>
                                  <p className="text-gray-700 leading-relaxed">
                                    "{selectedReview.comment}"
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span>Submitted: {formatDate(selectedReview.createdAt)}</span>
                                  <Badge 
                                    variant={selectedReview.isApproved ? "default" : "secondary"}
                                    className={selectedReview.isApproved ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                                  >
                                    {selectedReview.isApproved ? "Approved" : "Pending"}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {!review.isApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {review.isApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(review.id)}
                            disabled={isUpdating}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          disabled={isUpdating}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reviews found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
