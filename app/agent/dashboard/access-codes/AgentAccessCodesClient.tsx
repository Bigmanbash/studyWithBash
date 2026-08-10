"use client";

import { useState, useMemo } from "react";
import { KeyRound, CheckCircle2, XCircle, Share2, Copy, Search, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";

interface AgentAccessCodesClientProps {
  initialCodes: any[];
}

export function AgentAccessCodesClient({ initialCodes }: AgentAccessCodesClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unused" | "redeemed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filter codes
  const filteredCodes = useMemo(() => {
    return initialCodes.filter((code) => {
      // Tab filter
      if (activeTab !== "all" && code.status !== activeTab) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const courseTitle = code.course?.title?.toLowerCase() || "";
        const courseSubject = code.course?.subject?.toLowerCase() || "";
        const codeString = code.code.toLowerCase();

        if (!courseTitle.includes(query) && !courseSubject.includes(query) && !codeString.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [initialCodes, activeTab, searchQuery]);

  // Handle page resets when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredCodes.length / ITEMS_PER_PAGE);
  const paginatedCodes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCodes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCodes, currentPage]);

  // Derived stats
  const totalCodes = initialCodes.length;
  const unusedCodes = initialCodes.filter(c => c.status === "unused").length;
  const redeemedCodes = initialCodes.filter(c => c.status === "redeemed").length;
  const unusedCodeObjects = initialCodes.filter(c => c.status === "unused");

  // Selection logic
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCodes.length && filteredCodes.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCodes.map(c => c.id)));
    }
  };

  // Action helpers
  const generateWhatsAppUrl = (codeText: string, courseName: string) => {
    const text = `Your Bash Academy access code for ${courseName} is: ${codeText}\nRedeem at bashacademy.com/redeem`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const handleShareWhatsApp = (codeText: string, courseName: string) => {
    window.open(generateWhatsAppUrl(codeText, courseName), '_blank');
  };

  const handleCopySelected = () => {
    const codesToCopy = initialCodes.filter(c => selectedIds.has(c.id)).map(c => c.code).join("\n");
    if (codesToCopy) {
      navigator.clipboard.writeText(codesToCopy);
      alert("Selected codes copied to clipboard!");
    }
  };

  const handleShareSelected = () => {
    const textToShare = initialCodes.filter(c => selectedIds.has(c.id)).map(c => `Code for ${c.course?.title || 'course'}: ${c.code}`).join("\n");
    if (textToShare) {
      const fullText = `Here are your Bash Academy access codes:\n\n${textToShare}\n\nRedeem at bashacademy.com/redeem`;
      window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, '_blank');
    }
  };

  const handleCopyAllUnused = () => {
    const codesToCopy = unusedCodeObjects.map(c => c.code).join("\n");
    if (codesToCopy) {
      navigator.clipboard.writeText(codesToCopy);
      alert(`${unusedCodeObjects.length} unused codes copied!`);
    }
  };

  return (
    <div className="space-y-5 lg:space-y-6 mt-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-md p-3 sm:p-4 border border-neutral-200/80 shadow-2xs hover:border-[#17A546]/30 transition-all duration-200 group">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="bg-blue-500/10 rounded-md p-1.5 sm:p-2 border border-neutral-100 group-hover:scale-105 transition-transform duration-200">
              <KeyRound className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
              Total Codes
            </span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1B39] tracking-tight">
            {totalCodes}
          </p>
          <p className="text-xs text-[#676E85] mt-1 font-medium">Generated</p>
          <p className="text-[10px] sm:text-[11px] text-[#98A2B3] mt-0.5">All time access codes</p>
        </div>

        <div className="bg-white rounded-md p-3 sm:p-4 border border-neutral-200/80 shadow-2xs hover:border-[#17A546]/30 transition-all duration-200 group">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="bg-[#17A546]/10 rounded-md p-1.5 sm:p-2 border border-neutral-100 group-hover:scale-105 transition-transform duration-200">
              <CheckCircle2 className="h-4 w-4 text-[#17A546]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#17A546]/10 text-[#17A546] border border-[#17A546]/20">
              Unused
            </span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#17A546] tracking-tight">
            {unusedCodes}
          </p>
          <p className="text-xs text-[#676E85] mt-1 font-medium">Ready to share</p>
          <p className="text-[10px] sm:text-[11px] text-[#98A2B3] mt-0.5">Available for students</p>
        </div>

        <div className="bg-white rounded-md p-3 sm:p-4 border border-neutral-200/80 shadow-2xs hover:border-[#17A546]/30 transition-all duration-200 group">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="bg-purple-500/10 rounded-md p-1.5 sm:p-2 border border-neutral-100 group-hover:scale-105 transition-transform duration-200">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200">
              Redeemed
            </span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1B39] tracking-tight">
            {redeemedCodes}
          </p>
          <p className="text-xs text-[#676E85] mt-1 font-medium">Students in</p>
          <p className="text-[10px] sm:text-[11px] text-[#98A2B3] mt-0.5">Actively learning</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0A1B39]">Access Codes Directory</h3>
            <p className="text-xs text-[#676E85] mt-0.5">
              Manage all generated codes and their redemption status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {unusedCodes > 0 && (
              <button
                onClick={handleCopyAllUnused}
                className="w-full sm:w-auto px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#0A1B39] rounded-md font-bold text-xs transition-all shadow-2xs inline-flex items-center justify-center gap-2"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy All Unused</span>
              </button>
            )}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-2 text-[#98A2B3]" />
              <input
                type="text"
                placeholder="Search by course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200/80 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#17A546] text-[#0A1B39]"
              />
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 border-b border-neutral-200/80 pb-3 overflow-x-auto">
          {[
            { key: "all", label: `All (${totalCodes})` },
            { key: "unused", label: `Unused (${unusedCodes})` },
            { key: "redeemed", label: `Redeemed (${redeemedCodes})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key as any); setSelectedIds(new Set()); }}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shrink-0",
                activeTab === tab.key
                  ? "bg-[#17A546] text-white shadow-2xs"
                  : "text-[#676E85] hover:bg-neutral-100 hover:text-[#0A1B39]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="bg-neutral-50 border border-neutral-200/80 p-3 rounded-md flex items-center justify-between shadow-2xs">
            <span className="text-sm font-semibold text-[#0A1B39]">{selectedIds.size} codes selected</span>
            <div className="flex gap-2">
              <button
                onClick={handleCopySelected}
                className="px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-[#0A1B39] rounded-md font-bold text-xs transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
              <button
                onClick={handleShareSelected}
                className="px-3 py-1.5 bg-[#17A546] hover:bg-[#17A546]/90 text-white rounded-md font-bold text-xs transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share via WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* Main Table Card */}
        <div className="overflow-hidden border border-neutral-200/80 shadow-2xs rounded-md bg-white">
          {filteredCodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-3">
                <KeyRound className="h-6 w-6 text-[#98A2B3]" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-[#0A1B39]">
                {activeTab === "redeemed"
                  ? "No codes redeemed yet"
                  : activeTab === "unused"
                    ? "No unused codes available"
                    : "No access codes found"}
              </h3>
              <p className="text-xs text-[#676E85] mt-1">
                {activeTab === "redeemed"
                  ? "Share your codes with students so they can start learning."
                  : "You haven't purchased any access codes yet, or none match your search."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[162.5px] sm:min-w-[650px]">
                <thead>
                  <tr className="bg-neutral-50/60 border-b border-neutral-200/80">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredCodes.length && filteredCodes.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-neutral-300 text-[#17A546] focus:ring-[#17A546]"
                      />
                    </th>
                    <th className="px-2 py-3 text-[10px] uppercase font-bold tracking-wider text-[#676E85]">Code</th>
                    <th className="px-4 sm:px-5 py-3 text-[10px] uppercase font-bold tracking-wider text-[#676E85]">Course Details</th>
                    <th className="px-4 sm:px-5 py-3 text-[10px] uppercase font-bold tracking-wider text-[#676E85]">Status</th>
                    <th className="px-4 sm:px-5 py-3 text-[10px] uppercase font-bold tracking-wider text-[#676E85]">Redeemed By</th>
                    <th className="px-4 sm:px-5 py-3 text-[10px] uppercase font-bold tracking-wider text-[#676E85]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
                  {paginatedCodes.map((code) => {
                    const isExpired = code.expiresAt && new Date(code.expiresAt) < new Date();
                    const showExpiryUrgency = code.status === "unused" && code.expiresAt;

                    return (
                      <tr key={code.id} className={cn("hover:bg-neutral-50/60 transition-colors", selectedIds.has(code.id) && "bg-neutral-50/80")}>
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(code.id)}
                            onChange={() => toggleSelect(code.id)}
                            className="rounded border-neutral-300 text-[#17A546] focus:ring-[#17A546]"
                          />
                        </td>
                        <td className="px-2 py-3.5">
                          <span className="font-mono font-bold text-[#0A1B39] tracking-wider bg-neutral-100 px-2 py-1 rounded text-xs block w-fit">
                            {code.code}
                          </span>
                        </td>
                        <td className="px-3 sm:px-5 py-3.5 max-w-[130px] sm:max-w-[220px]">
                          <div className="font-semibold text-[#0A1B39] text-xs sm:text-sm truncate" title={code.course?.title || ""}>{code.course?.title || "Unknown Course"}</div>
                          <div className="flex items-center gap-2 mt-1 truncate">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#17A546] shrink-0">
                              {code.tier} Tier
                            </span>
                            {code.course?.subject && (
                              <>
                                <span className="text-[#D1D5DB]">•</span>
                                <span className="text-[10px] font-medium text-[#676E85] truncate">{code.course.subject}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {code.status === "unused" ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                                  <CheckCircle2 className="h-3 w-3" /> Unused
                                </span>
                              </div>
                            ) : code.status === "redeemed" ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                                  <CheckCircle2 className="h-3 w-3" /> Redeemed
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                                  <XCircle className="h-3 w-3" /> {code.status}
                                </span>
                              </div>
                            )}

                            {/* Expiry Urgency for Unused Codes */}
                            {showExpiryUrgency && !isExpired && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 mt-1 whitespace-nowrap">
                                <AlertCircle className="h-3 w-3" /> Expires {formatDate(code.expiresAt)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-5 py-3.5 max-w-[120px] sm:max-w-[180px]">
                          {code.status === "redeemed" && code.redeemedByUser ? (
                            <div>
                              <div className="font-semibold text-[#0A1B39] text-xs truncate">
                                {code.redeemedByUser.name}
                                {code.redeemedAt && <span className="text-[#676E85] font-normal text-[11px]"> · {formatDate(code.redeemedAt)}</span>}
                              </div>
                              <div className="text-[11px] text-[#676E85] truncate" title={code.redeemedByUser.email}>{code.redeemedByUser.email}</div>
                            </div>
                          ) : (
                            <span className="text-[#98A2B3] italic text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <CopyButton text={code.code} className="h-7 w-7 p-0" />
                            <button
                              onClick={() => handleShareWhatsApp(code.code, code.course?.title || "course")}
                              className="inline-flex items-center justify-center rounded-md h-7 w-7 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                              title="Share via WhatsApp"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Pagination component */}
        <div className="flex items-center justify-end rounded-b-md">
          <Pagination currentPage={currentPage} totalPages={Math.max(1, totalPages)} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}
