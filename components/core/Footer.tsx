'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mail, Heart, ExternalLink, Users, Coffee } from 'lucide-react';
import { footerSections, socialLinks } from '@/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Study Room</h3>
                  <Badge variant="secondary" className="text-xs">
                    v1.0
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A virtual productivity ecosystem that helps you stay focused, accountable, and
                consistent in your work or study routines while building a community around shared
                goals.
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Connect with us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className={`p-2 ${social.color} transition-colors`}
                    asChild
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            {/* <div className="space-y-3">
              <h4 className="font-semibold text-sm">Stay updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
                />
                <Button size="sm">Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get notified about new features and updates.
              </p>
            </div> */}
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold text-sm">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                    >
                      {link.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-12" />

        {/* Developer Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 py-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Coffee className="h-6 w-6 text-white dark:text-black" />
              </div>
              <div className="w-[290px] sm:w-auto">
                <h4 className="font-semibold">Built with passion by Krishang Sharma</h4>
                <p className="text-sm text-muted-foreground">
                  Full-stack developer passionate about productivity and community-driven solutions
                </p>
              </div>
            </div>
            <div className="flex gap-3 md:ml-auto">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://krishangsharma.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:krishang.sharma.17704@gmail.com">
                  Hire Me
                  <Mail className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">Built with modern technologies</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Next.js', 'TypeScript', 'Supabase', 'TailwindCSS', 'ShadCN UI'].map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span>© {currentYear} Study Room. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> for productivity
              enthusiasts
            </span>
          </div>
          <span>Version 1.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
