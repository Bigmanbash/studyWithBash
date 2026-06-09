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
    color: "text-[#676E85]",
    bg: "bg-neutral-100",
    read: true,
  },
];

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 pr-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
            <Bell className="h-5 w-5 text-[#0A1B39]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0A1B39]">Notifications</h3>
            <p className="text-xs text-[#676E85]">You have 1 unread notification</p>
          </div>
        </div>
        <button className="text-xs font-medium text-[#17A546] hover:underline whitespace-nowrap pt-1 flex-shrink-0">
          Mark all as read
        </button>
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors ${notification.read
                ? "bg-white border-neutral-100"
                : "bg-neutral-50 border-[#17A546]/20"
              }`}
          >
            {/* Icon */}
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.bg}`}
            >
              <notification.icon className={`h-5 w-5 ${notification.color}`} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0A1B39] leading-snug">
                {notification.title}
              </p>
              <p className="text-xs text-[#676E85] mt-1 line-clamp-2 leading-relaxed">
                {notification.message}
              </p>
              <p className="text-[10px] font-medium text-[#98A2B3] mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                {notification.time}
              </p>
            </div>

            {/* Unread dot */}
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-[#17A546] mt-1.5 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </ModalWrapper>
  );
}