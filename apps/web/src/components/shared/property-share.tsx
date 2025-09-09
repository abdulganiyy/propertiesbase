"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Share2,
  Copy,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  QrCode,
  Download,
  Check,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import type { Property } from "@/lib/api";

interface PropertyShareProps {
  property: Property;
  trigger?: React.ReactNode;
}

export function PropertyShare({ property, trigger }: PropertyShareProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailForm, setEmailForm] = useState({
    emails: "",
    message: "",
    senderName: "",
  });
  const [isSending, setIsSending] = useState(false);

  const propertyUrl = `${window.location.origin}/listings/${property.id}`;
  const shareTitle = `Check out this property: ${property.title}`;
  const shareDescription = `${property.bedrooms} bed, ${property.bathrooms} bath property in ${property.address} for $${property.price.toLocaleString()}/month`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      toast("Link copied!", {
        description: "Property link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy", {
        description: "Please copy the link manually.",
      });
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(
      `Hi,\n\nI thought you might be interested in this property:\n\n${shareTitle}\n${shareDescription}\n\nView details: ${propertyUrl}\n\nBest regards`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(`${shareTitle}\n${propertyUrl}`);
    window.open(`sms:?body=${message}`);
  };

  const shareViaFacebook = () => {
    const url = encodeURIComponent(propertyUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`${shareTitle} ${propertyUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(propertyUrl);
    const title = encodeURIComponent(shareTitle);
    const summary = encodeURIComponent(shareDescription);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
      "_blank"
    );
  };

  const sendEmailInvites = async () => {
    if (!emailForm.emails.trim() || !emailForm.senderName.trim()) {
      toast.error("Missing information", {
        description: "Please provide email addresses and your name.",
      });
      return;
    }

    setIsSending(true);
    try {
      // Simulate API call to send emails
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast("Emails sent!", {
        description: "Property details have been shared successfully.",
      });

      setEmailForm({ emails: "", message: "", senderName: "" });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to send", {
        description: "Please try again later.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const generateQRCode = () => {
    // In a real app, you'd use a QR code library
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(propertyUrl)}`;
    window.open(qrUrl, "_blank");
  };

  //   const downloadPropertyFlyer = () => {
  //     // In a real app, you'd generate a PDF flyer
  //     toast("Feature coming soon", {
  //       description: "Property flyer download will be available soon.",
  //     });
  //   };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Property</DialogTitle>
          <DialogDescription>
            Share this property with friends, family, or potential tenants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
            <p className="text-xs text-gray-600 mb-2">{property.address}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {property.bedrooms} bed
              </Badge>
              <Badge variant="outline" className="text-xs">
                {property.bathrooms} bath
              </Badge>
              {/* <Badge variant="outline" className="text-xs">
                ${property.price.toLocaleString()}/mo
              </Badge> */}
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <Label className="text-sm font-medium">Property Link</Label>
            <div className="flex gap-2 mt-1">
              <Input value={propertyUrl} readOnly className="text-xs" />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0 bg-transparent"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Share Options */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Quick Share
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareViaEmail}
                className="justify-start bg-transparent"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareViaSMS}
                className="justify-start bg-transparent"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareViaFacebook}
                className="justify-start bg-transparent"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareViaTwitter}
                className="justify-start bg-transparent"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareViaLinkedIn}
                className="justify-start bg-transparent"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateQRCode}
                className="justify-start bg-transparent"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>

          {/* <Separator /> */}

          {/* Email Invites */}
          {/* <div className="space-y-4">
            <Label className="text-sm font-medium">Send Email Invites</Label>

            <div>
              <Label htmlFor="senderName" className="text-xs text-gray-600">
                Your Name *
              </Label>
              <Input
                id="senderName"
                placeholder="Your name"
                value={emailForm.senderName}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, senderName: e.target.value })
                }
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="emails" className="text-xs text-gray-600">
                Email Addresses (comma separated) *
              </Label>
              <Input
                id="emails"
                placeholder="friend@example.com, family@example.com"
                value={emailForm.emails}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, emails: e.target.value })
                }
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-xs text-gray-600">
                Personal Message (optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Add a personal note..."
                value={emailForm.message}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, message: e.target.value })
                }
                rows={3}
                className="text-sm"
              />
            </div>

            <Button
              onClick={sendEmailInvites}
              disabled={isSending}
              className="w-full"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invites
                </>
              )}
            </Button>
          </div> */}

          {/* <Separator /> */}

          {/* Additional Options */}
          {/* <div>
            <Label className="text-sm font-medium mb-3 block">
              Additional Options
            </Label>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                // onClick={downloadPropertyFlyer}
                className="w-full justify-start bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Property Flyer (PDF)
              </Button>
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
