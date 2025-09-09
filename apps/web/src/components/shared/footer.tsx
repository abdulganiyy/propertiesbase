import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Link from "next/link";

interface FooterProps {
  variant?: "default" | "minimal";
}

export function Footer({ variant = "default" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <span className="font-semibold">PropertiesBase</span>
            </div>
            <p className="text-sm text-gray-500">
              © {currentYear} PropertiesBase. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-primary"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-primary"
              >
                Terms
              </Link>
              {/* <Link
                href="/support"
                className="text-sm text-gray-500 hover:text-primary"
              >
                Support
              </Link> */}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6">
              Get the latest property listings and platform updates delivered to
              your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-gray-400 mt-3">
              By subscribing, you agree to our{" "}
              <Link href="/privacy" className="underline hover:text-white">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="underline hover:text-white">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PropertiesBase</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Connect directly with property owners and skip the middleman. Save
              money and time with our platform.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/listings"
                className="text-gray-300 hover:text-white text-sm"
              >
                Browse Properties
              </Link>
              <Link
                href="/signup/owner"
                className="text-gray-300 hover:text-white text-sm"
              >
                List Your Property
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-300 hover:text-white text-sm"
              >
                How It Works
              </Link>
              {/* <Link
                href="/"
                className="text-gray-300 hover:text-white text-sm"
              >
                Pricing
              </Link> */}
              <Link
                href="/#about-us"
                className="text-gray-300 hover:text-white text-sm"
              >
                About Us
              </Link>
              {/* <Link
                href="/blog"
                className="text-gray-300 hover:text-white text-sm"
              >
                Blog
              </Link> */}
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/help"
                className="text-gray-300 hover:text-white text-sm"
              >
                Help Center
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white text-sm"
              >
                Contact Us
              </Link>
              {/* <Link
                href="/safety"
                className="text-gray-300 hover:text-white text-sm"
              >
                Safety Tips
              </Link>
              <Link
                href="/community"
                className="text-gray-300 hover:text-white text-sm"
              >
                Community Guidelines
              </Link>
              <Link
                href="/report"
                className="text-gray-300 hover:text-white text-sm"
              >
                Report Issue
              </Link>
              <Link
                href="/feedback"
                className="text-gray-300 hover:text-white text-sm"
              >
                Feedback
              </Link> */}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-white" />
                <span>support@propertiesbase.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-white" />
                <span>+234-7045-23-7590</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-white" />
                <span>123 Tech Street, Lagos, Nigeria</span>
                {/* <span>123 Tech Street, Lagis, CA 94105</span> */}
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-400">
                Available 24/7 for support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} PropertiesBase, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-white"
              >
                Privacy Policy
              </Link>
              {/* <Link
                href="/cookies"
                className="text-sm text-gray-400 hover:text-white"
              >
                Cookie Policy
              </Link>
              <Link
                href="/accessibility"
                className="text-sm text-gray-400 hover:text-white"
              >
                Accessibility
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
