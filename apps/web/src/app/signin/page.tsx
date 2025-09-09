"use client";
import { useEffect, useState } from "react";
import FormFactory from "@/components/custom/form-factory";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { loginFormSchema } from "@/schema/auth";
import { ArrowRightIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";
import AuthWrapper from "@/components/custom/auth-wrapper";
import { toast } from "sonner";
import type { FieldConfig, FormValues } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const loginFormFields: FieldConfig[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
];

export const loginErrorMessages = {
  INVALID_CREDENTIALS: "Invalid username or password.",
  NO_MATCHING_ROLES:
    "You do not have access to this portal. Contact your administrator for more information.",
  GENERIC_LOGIN_ERROR: "There was an error logging in.",
} as const;

export default function Home() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        payload
      );

      return response.data;
    },
    onSuccess: (data) => {
      const { access_token } = data;

      if (typeof window !== "undefined") {
        document.cookie = `token=${access_token};`;
      }

      const decodedToken = jwtDecode(access_token) as any;
      let role = decodedToken.role;

      if (role) {
        toast("Login Successful");

        role = role == "user" ? "" : role;

        setTimeout(() => {
          router.push(`/dashboard/${role}`);
        }, 500);
      } else {
        setLoginError(loginErrorMessages.NO_MATCHING_ROLES);
      }
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const message =
        status === 401
          ? loginErrorMessages.INVALID_CREDENTIALS
          : loginErrorMessages.GENERIC_LOGIN_ERROR;

      setLoginError(message);
      toast.error(message);
    },
  });

  async function handleLogin(data: FormValues): Promise<void> {
    setLoginError(null);
    mutate(data);
  }

  return (
    <AuthWrapper>
      <FormFactory
        fields={loginFormFields}
        schema={loginFormSchema}
        formWrapperClassName="flex flex-col"
        formFieldElClass="w-full"
        onSubmit={handleLogin}
        actionButtonsComponent={
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              type="submit"
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
            <Button
              onClick={() => router.push("/signup")}
              variant="link"
              type="button"
              className="text-sm font-semibold"
            >
              Sign Up
            </Button>
            <Button
              onClick={() => router.push("/forgot-password")}
              variant="link"
              type="button"
              className="text-sm font-semibold -mt-4"
            >
              Forgot Password <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>

            {loginError ? (
              <Label className="text-destructive">{loginError}</Label>
            ) : null}
          </div>
        }
      />
    </AuthWrapper>
  );
}
