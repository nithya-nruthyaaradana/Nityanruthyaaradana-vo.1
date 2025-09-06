
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Loader2, Trash2, PlusCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, onSnapshot, addDoc, deleteDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Prevent prerendering to avoid Firebase build-time errors
export const dynamic = 'force-dynamic';

interface HomePageContent {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroImageUrl: string;
  aboutSectionImageUrl: string;
}

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface Faq {
    id: string;
    question: string;
    answer: string;
}

export default function HomePageManagement() {
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<Partial<Feature> | null>(null);
  const [currentFaq, setCurrentFaq] = useState<Partial<Faq> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllContent = async () => {
        setIsLoading(true);
        try {
            // Fetch home page content
            const homeDocRef = doc(db, "pages", "home");
            const homeDocSnap = await getDoc(homeDocRef);
            if (homeDocSnap.exists()) {
                setContent(homeDocSnap.data() as HomePageContent);
            } else {
                setContent({
                    headline: "Discover the Divine Art of Bharatanatyam",
                    subheadline: "Experience the timeless beauty of India's classical dance form...",
                    ctaPrimary: "Begin Your Journey",
                    ctaSecondary: "Watch Our Story",
                    heroImageUrl: "https://placehold.co/1920x1080",
                    aboutSectionImageUrl: "https://placehold.co/600x400",
                });
            }
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Could not fetch homepage content.", variant: "destructive" });
        }

        // Subscribe to features
        const featuresQuery = query(collection(db, "features"), orderBy("order", "asc"));
        const unsubscribeFeatures = onSnapshot(featuresQuery, (snapshot) => {
            setFeatures(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feature)));
        });

        // Subscribe to FAQs
        const faqsQuery = query(collection(db, "faqs"), orderBy("order", "asc"));
        const unsubscribeFaqs = onSnapshot(faqsQuery, (snapshot) => {
            setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faq)));
        });

        setIsLoading(false);

        return () => {
            unsubscribeFeatures();
            unsubscribeFaqs();
        };
    };

    fetchAllContent();
  }, [toast]);

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "pages", "home"), content);
      toast({ title: "Success", description: "Home page content updated." });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({ title: "Error", description: "Could not save content.", variant: "destructive" });
    }
    setIsSaving(false);
  };
  
  const handleFeatureSave = async () => {
      if (!currentFeature || !currentFeature.title || !currentFeature.description) {
          toast({ title: "Error", description: "All fields are required for a feature.", variant: "destructive" });
          return;
      }
      setIsSaving(true);
      try {
          if (currentFeature.id) {
              const { id, ...data } = currentFeature;
              await updateDoc(doc(db, "features", id), data);
              toast({ title: "Success", description: "Feature updated." });
          } else {
              await addDoc(collection(db, "features"), { ...currentFeature, order: features.length + 1, createdAt: serverTimestamp() });
              toast({ title: "Success", description: "Feature added." });
          }
          setIsFeatureDialogOpen(false);
          setCurrentFeature(null);
      } catch (error) {
          console.error("Error saving feature:", error);
          toast({ title: "Error", description: "Could not save feature.", variant: "destructive" });
      }
      setIsSaving(false);
  };

  const handleFeatureDelete = async (featureId: string) => {
      try {
          await deleteDoc(doc(db, "features", featureId));
          toast({ title: "Success", description: "Feature deleted." });
      } catch (error) {
          console.error("Error deleting feature:", error);
          toast({ title: "Error", description: "Could not delete feature.", variant: "destructive" });
      }
  };

  const handleFaqSave = async () => {
      if (!currentFaq || !currentFaq.question || !currentFaq.answer) {
          toast({ title: "Error", description: "Question and answer are required.", variant: "destructive" });
          return;
      }
      setIsSaving(true);
      try {
          if (currentFaq.id) {
              const { id, ...data } = currentFaq;
              await updateDoc(doc(db, "faqs", id), data);
              toast({ title: "Success", description: "FAQ updated." });
          } else {
              await addDoc(collection(db, "faqs"), { ...currentFaq, order: faqs.length + 1, createdAt: serverTimestamp() });
              toast({ title: "Success", description: "FAQ added." });
          }
          setIsFaqDialogOpen(false);
          setCurrentFaq(null);
      } catch (error) {
          console.error("Error saving FAQ:", error);
          toast({ title: "Error", description: "Could not save FAQ.", variant: "destructive" });
      }
      setIsSaving(false);
  };

  const handleFaqDelete = async (faqId: string) => {
      try {
          await deleteDoc(doc(db, "faqs", faqId));
          toast({ title: "Success", description: "FAQ deleted." });
      } catch (error) {
          console.error("Error deleting FAQ:", error);
          toast({ title: "Error", description: "Could not delete FAQ.", variant: "destructive" });
      }
  };

  const handleInputChange = (field: keyof HomePageContent) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (content) {
      setContent({ ...content, [field]: e.target.value });
    }
  };

  if (isLoading || !content) {
    return (
      <div className="flex justify-center items-center h-full pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Home Page Content</h1>
      </div>
      
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Manage the main content of your homepage hero section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={content.headline} onChange={handleInputChange('headline')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subheadline">Subheadline</Label>
            <Textarea id="subheadline" rows={3} value={content.subheadline} onChange={handleInputChange('subheadline')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cta-primary">Primary Button Text</Label>
              <Input id="cta-primary" value={content.ctaPrimary} onChange={handleInputChange('ctaPrimary')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-secondary">Secondary Button Text</Label>
              <Input id="cta-secondary" value={content.ctaSecondary} onChange={handleInputChange('ctaSecondary')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Background Image</Label>
            <Card className="p-4">
                <div className="flex items-start gap-4">
                    <FallbackImage src={content.heroImageUrl} alt="Hero background" width={200} height={112} className="rounded-md object-cover border"/>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="hero-image-url">Image URL</Label>
                        <Input id="hero-image-url" value={content.heroImageUrl} onChange={handleInputChange('heroImageUrl')} placeholder="https://example.com/image.jpg"/>
                    </div>
                </div>
            </Card>
          </div>
           <div className="space-y-2">
            <Label>About Section Image</Label>
            <Card className="p-4">
                <div className="flex items-start gap-4">
                    <FallbackImage src={content.aboutSectionImageUrl} alt="About section image" width={200} height={112} className="rounded-md object-cover border"/>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="about-image-url">Image URL</Label>
                        <Input id="about-image-url" value={content.aboutSectionImageUrl} onChange={handleInputChange('aboutSectionImageUrl')} placeholder="https://example.com/image.jpg"/>
                    </div>
                </div>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Hero Section
            </Button>
        </CardFooter>
      </Card>
      
      {/* Features Section */}
      <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Features Section</CardTitle>
                        <CardDescription>Manage the features displayed on the homepage.</CardDescription>
                    </div>
                    <DialogTrigger asChild>
                        <Button onClick={() => setCurrentFeature({})}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                        </Button>
                    </DialogTrigger>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {features.map(feature => (
                    <Card key={feature.id} className="flex items-center justify-between p-4">
                        <div>
                            <h4 className="font-semibold">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <DialogTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => setCurrentFeature(feature)}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                             </DialogTrigger>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will permanently delete this feature.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleFeatureDelete(feature.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{currentFeature?.id ? 'Edit' : 'Add'} Feature</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="feature-title">Title</Label>
                    <Input id="feature-title" value={currentFeature?.title || ''} onChange={(e) => setCurrentFeature({...currentFeature, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="feature-icon">Icon Name</Label>
                    <Input id="feature-icon" value={currentFeature?.icon || ''} onChange={(e) => setCurrentFeature({...currentFeature, icon: e.target.value})} placeholder="e.g., Crown, Users, Theater" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="feature-desc">Description</Label>
                    <Textarea id="feature-desc" value={currentFeature?.description || ''} onChange={(e) => setCurrentFeature({...currentFeature, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="feature-color">Gradient Color</Label>
                    <Input id="feature-color" value={currentFeature?.color || ''} onChange={(e) => setCurrentFeature({...currentFeature, color: e.target.value})} placeholder="from-purple-500 to-pink-500" />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsFeatureDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleFeatureSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Feature
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* FAQ Section */}
      <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>FAQ Section</CardTitle>
                        <CardDescription>Manage the Frequently Asked Questions.</CardDescription>
                    </div>
                     <DialogTrigger asChild>
                        <Button onClick={() => setCurrentFaq({})}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
                        </Button>
                    </DialogTrigger>
                </div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {faqs.map(faq => (
                        <Card key={faq.id} className="p-0">
                          <AccordionItem value={faq.id} className="border-b-0">
                            <AccordionTrigger className="p-4 flex justify-between w-full hover:no-underline">
                                <span className="text-left">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 space-y-4">
                                <p className="text-muted-foreground">{faq.answer}</p>
                                <div className="flex items-center gap-2 justify-end">
                                     <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => setCurrentFaq(faq)}>
                                            <Edit className="mr-2 h-4 w-4"/> Edit
                                        </Button>
                                     </DialogTrigger>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="mr-2 h-4 w-4"/> Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This will permanently delete this FAQ.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleFaqDelete(faq.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{currentFaq?.id ? 'Edit' : 'Add'} FAQ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="faq-question">Question</Label>
                    <Input id="faq-question" value={currentFaq?.question || ''} onChange={(e) => setCurrentFaq({...currentFaq, question: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="faq-answer">Answer</Label>
                    <Textarea id="faq-answer" value={currentFaq?.answer || ''} onChange={(e) => setCurrentFaq({...currentFaq, answer: e.target.value})} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsFaqDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleFaqSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save FAQ
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
