"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export function ContactForm() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#0A1B39]/5 border border-neutral-100">
      <h3 className="text-xl font-bold text-[#0A1B39] mb-1">Send us a message</h3>
      <p className="text-sm text-[#676E85] mb-6">Fill out the form below and we&apos;ll get back to you shortly.</p>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First name" type="text" id="first-name" placeholder="John" />
          <Input label="Last name" type="text" id="last-name" placeholder="Doe" />
        </div>
        <Input label="Email" type="email" id="email" placeholder="john@example.com" />
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-[#485066] uppercase tracking-wide">Subject</label>
          <select className="flex h-12 w-full items-center rounded-xl border border-[#D1D5DB] bg-white px-3 py-2 text-base text-[#070D17] transition-colors focus-visible:outline-none focus-visible:border-[#3B82F6] focus-visible:ring-1 focus-visible:ring-[#3B82F6] appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2398A2B3%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10">
            <option value="">Select a topic</option>
            <option value="courses">Courses & Content</option>
            <option value="billing">Billing & Payments</option>
            <option value="technical">Technical Support</option>
            <option value="partnerships">Partnerships</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Textarea label="Message" id="message" rows={4} placeholder="How can we help you?" />
        <Button type="submit" className="w-full bg-[#17A546] hover:bg-[#17A546]/90 text-white h-12 rounded-xl font-bold shadow-lg shadow-[#17A546]/20">
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </form>
    </div>
  );
}
