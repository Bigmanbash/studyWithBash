import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface AdminPaymentData {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  method: string;
  reference: string;
  tier: string;
  proofUrl: string | null;
  student: {
    name: string | null;
    email: string | null;
  } | null;
  course: {
    subject: string | null;
    level: string | null;
  } | null;
  affiliate: {
    id: string;
    code: string;
  } | null;
}

export function useAdminPayments() {
  return useQuery<AdminPaymentData[]>({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const res = await fetch("/api/adminUser/payments");
      if (!res.ok) {
        throw new Error("Failed to fetch payments");
      }
      return res.json();
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const res = await fetch("/api/adminUser/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        throw new Error("Failed to update payment status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      // Also invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardRecentPayments"] });
    },
  });
}
