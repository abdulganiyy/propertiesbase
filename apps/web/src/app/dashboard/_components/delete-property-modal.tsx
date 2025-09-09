"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // if you're using shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"; // modal UI
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface DeletePropertyModalProps {
  propertyId: string;
}

export function DeletePropertyModal({ propertyId }: DeletePropertyModalProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(!open);
  };

  const mutation = useMutation({
    mutationFn: () => api.deleteProperty(propertyId),
    onSuccess: () => {
      // Invalidate or refetch properties list
      queryClient.invalidateQueries({ queryKey: ["all", "properties"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Error deleting property");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Delete Property</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Are you sure you want to delete this property? This action cannot be
          undone.
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
