"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSchedulePropertyView } from "@/hooks/use-properties";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

// ✅ Define schema
const scheduleSchema = yup.object({
  scheduledAt: yup.string().required("Please choose a date and time"),
  notes: yup.string().max(300, "Notes should not exceed 300 characters"),
});

type ScheduleFormValues = yup.InferType<typeof scheduleSchema>;

interface ScheduleViewingModalProps {
  propertyId: string;
  triggerLabel?: string;
}

export function ScheduleViewingModal({
  propertyId,
  triggerLabel = "Schedule Viewing",
}: ScheduleViewingModalProps) {
  const [open, setOpen] = useState(false);

  const { data: user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScheduleFormValues>({
    resolver: yupResolver(scheduleSchema as any),
  });

  const mutation = useSchedulePropertyView();

  const onSubmit = async (data: ScheduleFormValues) => {
    if (!user) {
      toast("Login to continue");

      return;
    }

    await mutation.mutateAsync({ ...data, propertyId });

    toast("Your booking has been added to owner's calendar");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="default">{triggerLabel}</Button> */}
        <Button variant="outline" className="w-full bg-transparent">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Viewing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Property Viewing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Date & Time</label>
            <Input type="datetime-local" {...register("scheduledAt")} />
            {errors.scheduledAt && (
              <p className="text-sm text-red-500">
                {errors.scheduledAt.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Notes (optional)
            </label>
            <Textarea
              {...register("notes")}
              placeholder="Any special requests or details?"
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Scheduling..." : "Confirm Viewing"}
          </Button>

          {mutation.isError && (
            <p className="text-sm text-red-500">
              {(mutation.error as Error).message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
