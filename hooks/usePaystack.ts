// ── usePaystack Hook ──────────────────────────────────────────────────────────
// Provides a `checkout(courseId)` function that:
// 1. Calls our server to initialize the transaction (server reads price from DB)
// 2. Opens the Paystack popup with the returned access_code via @paystack/inline-js
// 3. On success, calls our server to verify the transaction
// 4. Returns the result for the UI to react to

"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PaystackPop from "@paystack/inline-js";

export type PaystackStatus = "idle" | "loading" | "success" | "failed";

interface UsePaystackReturn {
  checkout: (courseId: string) => Promise<void>;
  status: PaystackStatus;
  error: string | null;
  reset: () => void;
}

export function usePaystack(): UsePaystackReturn {
  const [status, setStatus] = useState<PaystackStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  const checkout = useCallback(
    async (courseId: string) => {
      setStatus("loading");
      setError(null);

      try {
        // 1. Initialize on the server
        const initRes = await fetch("/api/paystack/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });

        const initData = await initRes.json();

        if (!initRes.ok) {
          setStatus("failed");
          setError(initData.error || "Failed to start payment");
          return;
        }

        const { access_code, reference } = initData;

        // 2. Open Paystack Popup via the installed SDK
        const popup = new PaystackPop();

        popup.resumeTransaction(access_code, {
          onSuccess: async () => {
            // 3. Verify on the server
            try {
              const verifyRes = await fetch("/api/paystack/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference }),
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok && verifyData.status === "approved") {
                setStatus("success");
                // Invalidate dashboard queries so purchased courses update
                queryClient.invalidateQueries({ queryKey: ["studentDashboard"] });
                queryClient.invalidateQueries({ queryKey: ["courseDetails", courseId] });
              } else {
                setStatus("failed");
                setError(verifyData.error || "Payment verification failed");
              }
            } catch {
              setStatus("failed");
              setError("Payment verification failed. If you were charged, contact support.");
            }
          },
          onCancel: () => {
            setStatus("idle");
          },
          onError: (err: { message: string }) => {
            setStatus("failed");
            setError(err.message || "Payment failed to load");
          },
        });
      } catch (err: any) {
        setStatus("failed");
        setError(err.message || "Something went wrong");
      }
    },
    [queryClient]
  );

  return { checkout, status, error, reset };
}
