// components/navbar.tsx - Optimized version
"use client";

import { memo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Menu, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

// Lazy load sheet components
const Sheet = dynamic(() => import("@/components/ui/sheet").then(mod => mod.Sheet), { ssr: false });
const SheetContent = dynamic(() => import("@/components/ui/sheet").then(mod => mod.SheetContent), { ssr: false });
const SheetTrigger = dynamic(() => import("@/components/ui/sheet").then(mod => mod.SheetTrigger), { ssr: false });

const NavLinks = memo(function NavLinks({ onClick }: { onClick?: () => void }) {
  const links = [
    { href: "/#features", text: "Features" },
    { href: "/#faqs", text: "FAQs" },
    { href: "/#reviews", text: "Reviews" },
  ];

  return (
    <>
      {links.map(({ href, text }) => (
        <Link
          key={href}
          href={href}
          onClick={onClick}
          className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
        >
          {text}
        </Link>
      ))}
    </>
  );
});

const ThemeIcon = memo(function ThemeIcon({ theme, mounted }: { theme: string | undefined, mounted: boolean }) {
  if (!mounted) return null;
  
  const icons = {
    system: <Monitor className="h-[1.15rem] w-[1.15rem]" />,
    dark: <Sun className="h-[1.15rem] w-[1.15rem]" />,
    light: <Moon className="h-[1.15rem] w-[1.15rem]" />
  };
  
  return icons[theme as keyof typeof icons] || icons.light;
});

export const Navbar = memo(function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Optimized scroll handler with RAF
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  const handleThemeChange = useCallback(() => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  }, [theme, resolvedTheme, setTheme]);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-background/75 backdrop-blur-md border-b" : "bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Play className="h-5 w-5 text-primary" strokeWidth={2.5} />
            <span className="font-medium tracking-tight">StreamVault</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeChange}
              className="hover:bg-secondary"
            >
              <ThemeIcon theme={theme} mounted={mounted} />
            </Button>
            <Button asChild variant="default" className="px-6">
              <Link href="/#packages">Get Started</Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeChange}
              className="hover:bg-secondary"
            >
              <ThemeIcon theme={theme} mounted={mounted} />
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-6">
                <nav className="flex flex-col space-y-6 mt-4">
                  <NavLinks onClick={() => setIsOpen(false)} />
                  <Button asChild className="w-full mt-4" size="lg">
                    <Link href="/#packages" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
});
