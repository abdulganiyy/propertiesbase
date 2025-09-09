"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Something went wrong");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="rounded-2xl bg-white shadow-md p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <div>
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
            <p className="text-gray-500">Please wait</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <h2 className="text-2xl font-bold text-green-600">
              ✅ Email Verified!
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <a
              href="/signin"
              className="mt-4 inline-block rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
            >
              Go to Login
            </a>
          </div>
        )}

        {status === "error" && (
          <div>
            <h2 className="text-2xl font-bold text-red-600">
              ❌ Verification Failed
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
            {/* <a
              href="/auth/resend-verification"
              className="mt-4 inline-block rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
            >
              Resend Verification Email
            </a> */}
          </div>
        )}
      </div>
    </div>
  );
}
