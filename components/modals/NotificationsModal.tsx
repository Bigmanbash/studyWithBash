"use client";

import { ModalWrapper } from "./ModalWrapper";
import { Bell, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    title: "Payment Approved",
    message: "Payment for Physics SS1 has been approved.",
    time: "10 mins ago",
    icon: CheckCircle2,
    color: "text-[#0E7B33]",
    bg: "bg-[#E7F6EC]",
    read: false,
  },
  {
    id: 2,
    title: "New Support Ticket",
    message: "A new support ticket has been submitted regarding mathematics quiz.",
    time: "2 hours ago",
    icon: AlertCircle,
    color: "text-[#F5B546]",
    bg: "bg-[#FEF6E7]",
    read: true,
  },
  {
    id: 3,
    title: "System Update",
    message: "The platform will undergo maintenance tonight at 2 AM.",
    time: "1 day ago",
    icon: Bell,
    color: "text-(--muted)",
    bg: "bg-(--card)",
    read: true,
  },
];

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-(--card) flex items-center justify-center">
            <Bell className="h-5 w-5 text-(--heading)" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-(--heading)">Notifications</h3>
            <p className="text-xs text-(--muted)">You have 1 unread notification</p>
          </div>
        </div>
        <button className="text-xs font-medium text-[#17A546] hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-4 p-4 rounded-2xl sm:rounded-3xl border transition-colors ${
              notification.read
                ? "bg-(--card) border-border"
                : "bg-[rgba(148,163,184,0.08)] border-[#17A546]/20"
            }`}
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.bg}`}>
              <notification.icon className={`h-5 w-5 ${notification.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${notification.read ? "text-(--heading)" : "text-(--heading)"}`}>
                {notification.title}
              </p>
              <p className="text-xs text-(--muted) mt-1 line-clamp-2">
                {notification.message}
              </p>
              <p className="text-[10px] font-medium text-(--muted) mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {notification.time}
              </p>
            </div>
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-[#17A546] mt-2 flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
}
