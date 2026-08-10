// ── usePaystack Hook ──────────────────────────────────────────────────────────
// Provides a `checkout(courseId, tier)` function that:
// 1. Calls our server to initialize the transaction with selected tier
// 2. Opens the Paystack popup with returned access_code
// 3. Verifies transaction on success and invalidates query cache

"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PaystackPop from "@paystack/inline-js";
import { TierKey } from "@/lib/tiers";

export type PaystackStatus = "idle" | "loading" | "success" | "failed";

interface UsePaystackReturn {
  checkout: (courseId: string, tier?: TierKey, quantity?: number) => Promise<void>;
  status: PaystackStatus;
  error: string | null;
  data: any;
  reset: () => void;
}

export function usePaystack(): UsePaystackReturn {
  const [status, setStatus] = useState<PaystackStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const queryClient = useQueryClient();

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setData(null);
  }, []);

  const checkout = useCallback(
    async (courseId: string, tier: TierKey = "basic", quantity: number = 1) => {
      setStatus("loading");
      setError(null);

      try {
        // 1. Initialize on the server with tier
        const initRes = await fetch("/api/paystack/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, tier, quantity }),
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
                setData(verifyData);
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

  return { checkout, status, error, data, reset };
}
