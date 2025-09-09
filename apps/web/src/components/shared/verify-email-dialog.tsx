"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VerifyEmailDialogProps {
  user: {
    email: string;
    isUserVerified: boolean;
  } | null;
}

export default function VerifyEmailDialog({ user }: VerifyEmailDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && !user.isUserVerified) {
      setOpen(true);
    }
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Email Verification Required</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Hi <span className="font-medium">{user.email}</span>, please verify
            your email by checking your email box to continue using all
            features.
          </p>
          {/* <Button
            className="w-full"
            onClick={() => {
              // Call API to resend verification link
              fetch("/api/auth/resend-verification", { method: "POST" });
            }}
          >
            Resend Verification Link
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
