"use client";
import { useState } from "react";
import FormFactory from "@/components/custom/form-factory";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signUpFormSchema } from "@/schema/auth";
import { ArrowRightIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import AuthWrapper from "@/components/custom/auth-wrapper";
import { toast } from "sonner";

import type { FieldConfig, FormValues } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { delay } from "@/lib/utils";

export const signUpFormFields: FieldConfig[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter phone number",
  },
  {
    name: "firstname",
    label: "First Name",
    type: "text",
    placeholder: "Enter your First Name",
  },
  {
    name: "lastname",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your Last Name",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "••••••••",
  },
];

export default function SignUp() {
  const router = useRouter();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        payload
      );

      return response.data;
    },
    onSuccess: async (data) => {
      const { message } = data;
      toast(message);
      await delay(1000);
      router.push("/signin");
    },
    onError: () => {
      console.log(error);
      toast.error(error?.message || "Unable to signup, please try again");
    },
  });

  async function handleSignUp(data: FormValues): Promise<void> {
    const { confirmPassword, ...payload } = data;
    await mutateAsync(payload);
  }

  return (
    <AuthWrapper>
      <FormFactory
        fields={signUpFormFields}
        schema={signUpFormSchema}
        formWrapperClassName="flex flex-col"
        formFieldElClass="w-full"
        onSubmit={handleSignUp}
        actionButtonsComponent={
          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isPending ? "Signing up..." : "Sign up"}
            </Button>
            <Button
              onClick={() => router.push("/signin")}
              variant="link"
              type="button"
              className="text-sm font-semibold"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/forgot-password")}
              variant="link"
              type="button"
              className="text-sm font-semibold -mt-4"
            >
              Forgot Password <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        }
      />
    </AuthWrapper>
  );
}
