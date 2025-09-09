"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import * as yup from "yup";
import { api } from "@/lib/api";
import { useSubmitProperty } from "@/hooks/use-properties";
import { toast } from "sonner";

const propertySchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  status: yup.string().required("Status is required"),
});

interface EditPropertyModalProps {
  property: {
    id: string;
    title: string;
    description?: string;
    price?: number;
    status?: string;
  };
}

export function EditPropertyModal({ property }: EditPropertyModalProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(propertySchema),
    defaultValues: {
      title: property.title,
      description: property.description || "",
      price: property.price || 0,
      status: property.status || "PENDING",
    },
  });

  const status = watch("status");

  const {
    mutateAsync,
    isPending,
    error: submitPropertyError,
  } = useSubmitProperty();

  const onSubmit = async (data: any) => {
    try {
      await mutateAsync({ id: property.id, ...data });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Error updating property");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button>
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-6 max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...register("title")} readOnly />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} readOnly />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label>Price</Label>
            <Input type="number" {...register("price")} readOnly />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(val) =>
                setValue("status", val as "approved" | "pending" | "delisted")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                <SelectItem value="DELISTED">DELISTED</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
