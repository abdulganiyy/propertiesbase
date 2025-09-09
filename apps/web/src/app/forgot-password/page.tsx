"use client";
import { useEffect, useState } from "react";
import FormFactory from "@/components/custom/form-factory";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { forgotPasswordFormSchema } from "@/schema/auth";
import { ArrowRightIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import AuthWrapper from "@/components/custom/auth-wrapper";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

import type { FieldConfig, FormValues } from "@/types";

export const forgotPasswordFormFields: FieldConfig[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
];

export const errorMessages = {
  GENERIC_ERROR: "There was an error resetting your password.",
} as const;

export default function ForgotPassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { GENERIC_ERROR } = errorMessages;
  //   const { toast } = useToast();

  async function handleForgotPassword(data: FormValues): Promise<void> {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const { message } = await response.json();
        toast(message);
        setIsSubmitting(false);
      }
    } catch (error) {
      setError(GENERIC_ERROR);
      setIsSubmitting(false);
      toast.error("Uh oh! Something went wrong.");
    }
  }

  return (
    <AuthWrapper>
      <FormFactory
        fields={forgotPasswordFormFields}
        schema={forgotPasswordFormSchema}
        formWrapperClassName="flex flex-col"
        formFieldElClass="w-full"
        onSubmit={handleForgotPassword}
        actionButtonsComponent={
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <Button
              onClick={() => router.push("/signin")}
              variant="link"
              type="button"
              className="text-green-600 hover:text-green-700"
            >
              Sign In
            </Button>

            {error ? <Label className="text-destructive">{error}</Label> : null}
          </div>
        }
      />
    </AuthWrapper>
  );
}
