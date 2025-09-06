
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Globe, Phone, Mail, Facebook, Instagram, Youtube, ShieldAlert } from 'lucide-react';

// Prevent prerendering to avoid Firebase build-time errors
export const dynamic = 'force-dynamic';

interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  maintenanceMode: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      } else {
        setSettings({
          siteName: "Nithyanruthyaaradana",
          contactEmail: "info@nithyanruthyaaradana.art",
          contactPhone: "+91 123 456 7890",
          facebookUrl: "",
          instagramUrl: "",
          youtubeUrl: "",
          maintenanceMode: false,
        });
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "general"), settings);
      toast({ title: "Success", description: "Settings updated successfully." });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "Error", description: "Could not save settings.", variant: "destructive" });
    }
    setIsSaving(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    const { id, value } = e.target;
    setSettings({ ...settings, [id]: value });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    if (!settings) return;
    setSettings({ ...settings, maintenanceMode: checked });
  };

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center items-center h-full pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save All Settings
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Update your site's general and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <Input id="siteName" value={settings.siteName} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Input id="contactEmail" type="email" value={settings.contactEmail} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <Input id="contactPhone" type="tel" value={settings.contactPhone} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Link your social media profiles to be displayed on the site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <div className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-muted-foreground" />
                <Input id="facebookUrl" placeholder="https://facebook.com/your-page" value={settings.facebookUrl} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
               <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-muted-foreground" />
                <Input id="instagramUrl" placeholder="https://instagram.com/your-profile" value={settings.instagramUrl} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
               <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-muted-foreground" />
                <Input id="youtubeUrl" placeholder="https://youtube.com/your-channel" value={settings.youtubeUrl} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Advanced Settings</CardTitle>
          <CardDescription>Be careful with these settings as they can affect the entire site.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <Label htmlFor="maintenanceMode" className="font-semibold">Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">Temporarily disable public access to the site.</p>
          </div>
          <Switch id="maintenanceMode" checked={settings.maintenanceMode} onCheckedChange={handleSwitchChange} />
        </CardContent>
      </Card>
    </div>
  );
}
