
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Image as ImageIcon, LayoutTemplate, LayoutPanelLeft, MessageSquare } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/pages/home', label: 'Home Page', icon: LayoutTemplate },
  { href: '/admin/pages/about', label: 'About Page', icon: LayoutPanelLeft },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <span>
                        <item.icon />
                        <span>{item.label}</span>
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="flex items-center p-6 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
            <SidebarTrigger>
              <button className="p-2 rounded-md hover:bg-accent/10 dark:hover:bg-accent/10">
                <LayoutPanelLeft className="h-6 w-6" />
              </button>
            </SidebarTrigger>
            <h1 className="text-2xl font-semibold ml-4">
              {adminNavItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
            </h1>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
