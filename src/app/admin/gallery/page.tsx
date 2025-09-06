
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreVertical, Trash2, Loader2 } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Badge } from "@/components/ui/badge";
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

// Prevent prerendering to avoid Firebase build-time errors
export const dynamic = 'force-dynamic';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  storagePath?: string;
}

export default function GalleryManagementPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images: GalleryImage[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
      setGalleryImages(images);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching gallery images: ", error);
      toast({ title: "Error", description: "Could not fetch gallery images.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleAddImage = async () => {
    if (!newImageUrl.trim() || !newImageAlt.trim()) {
      toast({ title: "Error", description: "Image URL and description are required.", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "gallery"), {
        src: newImageUrl,
        alt: newImageAlt,
        category: "General",
        createdAt: serverTimestamp(),
      });
      toast({ title: "Success", description: "Image added successfully." });
      setNewImageUrl('');
      setNewImageAlt('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding image:", error);
      toast({ title: "Error", description: "Could not add image.", variant: "destructive" });
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    try {
      if (image.storagePath) {
        const imageRef = ref(storage, image.storagePath);
        await deleteObject(imageRef);
      }
      await deleteDoc(doc(db, "gallery", image.id));
      toast({ title: "Success", description: "Image deleted successfully." });
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        await deleteDoc(doc(db, "gallery", image.id));
        toast({ title: "Warning", description: "Image file not found in storage, but record was deleted.", variant: "default" });
      } else {
        console.error("Error deleting image:", error);
        toast({ title: "Error", description: "Could not delete image. " + error.message, variant: "destructive" });
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Image
              </Button>
            </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="https://..."/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="altText">Description</Label>
              <Input id="altText" value={newImageAlt} onChange={(e) => setNewImageAlt(e.target.value)} placeholder="e.g., Dancer in red costume"/>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddImage}>Save Image</Button>
          </DialogFooter>
        </DialogContent>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative">
                    <FallbackImage src={image.src} alt={image.alt} width={400} height={300} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive cursor-pointer">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                  </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This will permanently delete the image. This action cannot be undone.
                                  </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(image)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-3 bg-card flex flex-col items-start">
                  <p className="text-sm font-medium truncate w-full" title={image.alt}>{image.alt}</p>
                  <Badge variant="outline" className="mt-2">{image.category}</Badge>
                </CardFooter>
              </Card>
            ))}
            <DialogTrigger asChild>
              <Card className="flex items-center justify-center border-2 border-dashed hover:border-primary hover:text-primary transition-colors duration-300 cursor-pointer min-h-[268px]">
                  <div className="text-center text-muted-foreground">
                      <PlusCircle className="h-8 w-8 mx-auto mb-2"/>
                      <span>Add New Image</span>
                  </div>
              </Card>
            </DialogTrigger>
          </div>
        )}
      </div>
    </Dialog>
  );
}
