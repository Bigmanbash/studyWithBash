import { useQuery } from "@tanstack/react-query";

export interface AdminCommissionData {
  id: string;
  amount: number;
  type: "referral" | "proxy";
  status: "pending" | "credited" | "paid";
  createdAt: string;
  affiliate: {
    id: string;
    code: string;
    user: {
      name: string | null;
      email: string | null;
    } | null;
  } | null;
  student: {
    name: string | null;
    email: string | null;
  } | null;
  course: {
    subject: string | null;
    level: string | null;
  } | null;
  payment: {
    id: string;
    amount: number;
    reference: string | null;
  } | null;
}

export function useAdminCommissions() {
  return useQuery<AdminCommissionData[]>({
    queryKey: ["admin-commissions"],
    queryFn: async () => {
      const res = await fetch("/api/adminUser/commissions");
      if (!res.ok) {
        throw new Error("Failed to fetch commissions");
      }
      return res.json();
    },
  });
}
