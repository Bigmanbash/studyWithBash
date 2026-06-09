import { create } from "zustand";

interface AdminState {
  statusModal: {
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "loading";
  };
  setStatusModal: (options: Partial<AdminState["statusModal"]>) => void;
  closeStatusModal: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  statusModal: {
    isOpen: false,
    title: "",
    message: "",
    type: "loading",
  },
  setStatusModal: (options) =>
    set((state) => ({
      statusModal: { ...state.statusModal, ...options, isOpen: true },
    })),
  closeStatusModal: () =>
    set((state) => ({
      statusModal: { ...state.statusModal, isOpen: false },
    })),
}));
