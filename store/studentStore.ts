import { create } from "zustand";

interface StudentState {
  statusModal: {
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "loading";
  };
  setStatusModal: (options: Partial<StudentState["statusModal"]>) => void;
  closeStatusModal: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
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
