"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  MoreHorizontal,
  AlertCircle,
  ExternalLink,
  X,
  ChevronsLeft,
  ChevronsRight,
  Lock,
  ShoppingCart,
  ShieldAlert,
} from "lucide-react";

// Use local same-origin worker from public/ to guarantee 0 CORS / CDN worker blocking
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}


/** Convert any Google Docs / S3 / remote URL to a proxied PDF export URL */
function toPDFSrc(src: string): string {
  // Google Docs → convert to PDF export link
  if (src.includes("docs.google.com/document")) {
    const m = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m) {
      const exportUrl = `https://docs.google.com/document/d/${m[1]}/export?format=pdf`;
      return `/api/pdf-proxy?url=${encodeURIComponent(exportUrl)}`;
    }
  }
  // S3 / any remote URL → proxy through our API to avoid CORS & hide real URL
  if (src.startsWith("http")) {
    return `/api/pdf-proxy?url=${encodeURIComponent(src)}`;
  }
  return src;
}

interface EmbedPDFProps {
  src: string;
  title?: string;
  /** When true, limits navigation to `previewPageLimit` pages and shows a paywall */
  isPreview?: boolean;
  /** Number of pages the user can see in preview mode (default 3) */
  previewPageLimit?: number;
  /** Custom watermark text override */
  watermarkText?: string;
  /** Callback when the user clicks the purchase CTA on the paywall */
  onRequestPurchase?: () => void;
}

export function EmbedPDF({
  src,
  title = "Course Document",
  isPreview = false,
  previewPageLimit = 3,
  watermarkText,
  onRequestPurchase,
}: EmbedPDFProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showMore, setShowMore] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");
  const [animKey, setAnimKey] = useState(0);
  const [pageWidth, setPageWidth] = useState(680);
  const [isInactive, setIsInactive] = useState(false);

  const [errorStatus, setErrorStatus] = useState<"locked" | "not_found" | "error" | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const pdfSrc = toPDFSrc(src);
  const watermarkLabel = watermarkText || "Studywithbash.online";

  // Anti-snipping & focus loss blur
  useEffect(() => {
    const handleBlur = () => setIsInactive(true);
    const handleFocus = () => setIsInactive(false);
    const handleVisibility = () => {
      if (document.hidden) setIsInactive(true);
      else setIsInactive(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || ((e.ctrlKey || e.metaKey) && e.key === "p")) {
        e.preventDefault();
        setIsInactive(true);
        setTimeout(() => setIsInactive(false), 2000);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorStatus(null);
    setPageNum(1);
  }, [src]);

  // In preview mode, the effective last page is whichever is smaller:
  // the actual doc length or the preview cap
  const effectiveLastPage = isPreview && numPages
    ? Math.min(numPages, previewPageLimit)
    : numPages;
  const isLastPage = effectiveLastPage !== null && pageNum >= effectiveLastPage;
  const isPreviewLocked = isPreview && effectiveLastPage !== null && pageNum >= effectiveLastPage;

  // ── ResizeObserver: keep page width matched to the viewer ──────────
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.max(entry.contentRect.width - 96, 320);
      setPageWidth(Math.min(w, 1100));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Fullscreen sync ────────────────────────────────────────────────
  useEffect(() => {
    const h = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // ── Click-outside closes "More" menu ──────────────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node))
        setShowMore(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Keyboard navigation ────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextPage();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevPage();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [pageNum, numPages]);

  const prevPage = useCallback(() => {
    if (pageNum > 1) {
      setSlideDir("right");
      setAnimKey((k) => k + 1);
      setPageNum((p) => p - 1);
    }
  }, [pageNum]);

  const nextPage = useCallback(() => {
    if (!isLastPage) {
      setSlideDir("left");
      setAnimKey((k) => k + 1);
      setPageNum((p) => p + 1);
    }
  }, [isLastPage]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 15, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 15, 50));

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleDocumentError = async (err: any) => {
    console.error("[EmbedPDF] Document load error:", err);
    setIsLoading(false);
    setHasError(true);

    try {
      const checkRes = await fetch(pdfSrc, { method: "HEAD" });
      if (checkRes.status === 403 || checkRes.status === 401) {
        setErrorStatus("locked");
        return;
      }
      if (checkRes.status === 404) {
        setErrorStatus("not_found");
        return;
      }
    } catch {
      // ignore
    }
    setErrorStatus("error");
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: isFullscreen ? "fixed" : "relative",
        inset: isFullscreen ? 0 : "auto",
        width: "100%",
        height: "100%",
        background: "#F2F2F7",
        display: "flex",
        flexDirection: "column",
        zIndex: isFullscreen ? 9999 : "auto",
      }}
    >
      {/* ── READER AREA ─────────────────────────────────────────────── */}
      <div ref={viewerRef} style={{ position: "relative", flex: 1, overflow: "hidden" }}>

        {/* Loading shimmer */}
        {isLoading && !hasError && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "white", display: "flex", flexDirection: "column",
          }}>
            <div style={{
              height: 44, background: "#FAFAFA",
              borderBottom: "1px solid #F0F0F0",
              display: "flex", alignItems: "center", gap: 12, padding: "0 20px",
              flexShrink: 0,
            }}>
              <div style={{ width: 80, height: 8, borderRadius: 999, background: "#EBEBEB" }} className="shimmer" />
              <div style={{ flex: 1 }} />
              <div style={{ width: 48, height: 8, borderRadius: 999, background: "#EBEBEB" }} className="shimmer" />
            </div>
            <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[100, 88, 94, 72, 85, 60, 78, 75, 90, 65, 82, 55, 88, 78, 92, 55, 83, 68, 76, 90].map((w, i) => (
                <div key={i} className="shimmer" style={{
                  height: 10, borderRadius: 999,
                  background: "#F0F0F0",
                  width: `${w}%`,
                  animationDelay: `${i * 35}ms`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Locked / Forbidden Paywall state */}
        {hasError && errorStatus === "locked" && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "#FAFAF9",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18,
            padding: 32, textAlign: "center",
          }}>
            <div style={{
              width: 58, height: 58, borderRadius: 18,
              background: "#FEF3C7", color: "#D97706",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(217, 119, 6, 0.12)",
            }}>
              <Lock size={26} />
            </div>
            <div style={{ maxWidth: 420 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A1B39", margin: "0 0 6px" }}>
                This Study Material is Locked
              </h3>
              <p style={{ fontSize: 13, color: "#676E85", margin: 0, lineHeight: 1.5 }}>
                Enroll in this course to gain full access to all reading materials, videos, and study resources.
              </p>
            </div>
            {onRequestPurchase && (
              <button
                onClick={onRequestPurchase}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 22px", borderRadius: 10,
                  background: "#17A546", color: "#FFFFFF",
                  fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(23, 165, 70, 0.25)",
                }}
              >
                <ShoppingCart size={16} /> Unlock Full Course
              </button>
            )}
          </div>
        )}

        {/* Not Found state */}
        {hasError && errorStatus === "not_found" && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "#FAFAF9",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
            padding: 32, textAlign: "center",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "#F3F4F6", color: "#6B7280",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <AlertCircle size={24} />
            </div>
            <div style={{ maxWidth: 380 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A1B39", margin: "0 0 4px" }}>
                Material Not Available
              </h3>
              <p style={{ fontSize: 13, color: "#676E85", margin: 0 }}>
                This study document is not available or has been moved.
              </p>
            </div>
          </div>
        )}

        {/* Generic Error state */}
        {hasError && errorStatus !== "locked" && errorStatus !== "not_found" && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "white",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
            padding: 24, textAlign: "center",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "#FEF2F2",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <AlertCircle size={22} color="#F87171" />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0A1B39", margin: "0 0 4px" }}>
                Unable to load document
              </p>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
                An unexpected error occurred while loading this document.
              </p>
            </div>
            <button
              onClick={() => {
                setIsLoading(true);
                setHasError(false);
                setErrorStatus(null);
              }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 12, fontWeight: 600, color: "#17A546",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              <ExternalLink size={13} /> Retry
            </button>
          </div>
        )}

        {/* ── react-pdf Document + Page ─────────────────────────────── */}
        <div
          style={{
            position: "absolute", inset: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 48px 32px",
            opacity: isLoading || hasError ? 0 : 1,
            transition: "opacity 0.25s ease",
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Document
            file={pdfSrc}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              setIsLoading(false);
              setHasError(false);
              setErrorStatus(null);
            }}
            onLoadError={handleDocumentError}
            loading={null}
            error={null}
          >
            {/* Keyed wrapper triggers the slide animation on page change */}
            <div
              key={animKey}
              className={`page-slide-${slideDir}`}
              style={{
                position: "relative",
                boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
                borderRadius: 6,
                overflow: "hidden",
                userSelect: "none",
                background: "#FFFFFF",
                filter: isInactive ? "blur(18px)" : "none",
                transition: "filter 0.2s ease",
              }}
            >
              <Page
                pageNumber={pageNum}
                width={Math.round(pageWidth * (zoom / 100))}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />

              {/* Dynamic User Watermark Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                  overflow: "hidden",
                  zIndex: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "space-around",
                  justifyContent: "space-around",
                  opacity: 0.12,
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      transform: "rotate(-25deg)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0A1B39",
                      padding: "36px 40px",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {watermarkLabel}
                  </div>
                ))}
              </div>
            </div>
          </Document>

          {/* Inactive Window / Snipping Protection Warning */}
          {isInactive && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 30,
                backdropFilter: "blur(20px)",
                background: "rgba(242, 242, 247, 0.85)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0A1B39]/10 text-[#0A1B39] flex items-center justify-center shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#0A1B39]">Content Protected</p>
              <p className="text-xs text-[#676E85]">Click inside the window to resume reading</p>
            </div>
          )}

          {/* Page counter badge — floats below the page */}
          {numPages && (
            <div style={{
              marginTop: 16,
              padding: "5px 14px",
              background: "rgba(10,27,57,0.55)",
              backdropFilter: "blur(8px)",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              color: "white",
              letterSpacing: "0.02em",
              userSelect: "none",
            }}>
              {pageNum} / {isPreview ? `${effectiveLastPage} (preview)` : numPages}
            </div>
          )}
        </div>

        {/* ── Preview Paywall Overlay ──────────────────────────────── */}
        {isPreviewLocked && (
          <div
            className="preview-paywall-enter"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              pointerEvents: "auto",
            }}
          >
            {/* Gradient veil — bottom-up fade */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 10%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.92) 75%, rgba(255,255,255,0.98) 100%)",
              backdropFilter: "blur(2px)",
            }} />

            {/* CTA card */}
            <div
              className="preview-paywall-card"
              style={{
                position: "relative",
                zIndex: 1,
                marginBottom: 48,
                background: "rgba(255,255,255,0.80)",
                backdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(10,27,57,0.08)",
                borderRadius: 20,
                padding: "32px 36px",
                maxWidth: 380,
                width: "90%",
                textAlign: "center",
                boxShadow: "0 8px 40px rgba(10,27,57,0.10), 0 1.5px 6px rgba(10,27,57,0.06)",
              }}
            >
              {/* Lock icon */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 2px 8px rgba(251,191,36,0.18)",
              }}>
                <Lock size={22} color="#B45309" />
              </div>

              <h3 style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#0A1B39",
                margin: "0 0 6px",
                letterSpacing: "-0.01em",
              }}>
                You've reached the preview limit
              </h3>

              <p style={{
                fontSize: 13,
                color: "#676E85",
                margin: "0 0 24px",
                lineHeight: 1.5,
              }}>
                You've previewed {effectiveLastPage} of {numPages} pages.
                Purchase to unlock the full material.
              </p>

              <button
                onClick={onRequestPurchase}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: "#17A546",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  boxShadow: "0 2px 10px rgba(23,165,70,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(23,165,70,0.30), inset 0 1px 0 rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 10px rgba(23,165,70,0.25), inset 0 1px 0 rgba(255,255,255,0.15)";
                }}
              >
                <ShoppingCart size={15} />
                Purchase Full Material
              </button>
            </div>
          </div>
        )}

        {/* Left ghost arrow */}
        <button
          onClick={prevPage}
          disabled={pageNum <= 1}
          aria-label="Previous page"
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: 36,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: pageNum <= 1 ? "default" : "pointer",
            color: pageNum <= 1 ? "rgba(10,27,57,0.15)" : "rgba(10,27,57,0.35)",
            transition: "color 0.15s",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseEnter={(e) => { if (pageNum > 1) (e.currentTarget as HTMLButtonElement).style.color = "rgba(10,27,57,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = pageNum <= 1 ? "rgba(10,27,57,0.15)" : "rgba(10,27,57,0.35)"; }}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>

        {/* Right ghost arrow */}
        <button
          onClick={nextPage}
          disabled={isLastPage}
          aria-label="Next page"
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: 36,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: isLastPage ? "default" : "pointer",
            color: isLastPage ? "rgba(10,27,57,0.15)" : "rgba(10,27,57,0.35)",
            transition: "color 0.15s",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseEnter={(e) => { if (!isLastPage) (e.currentTarget as HTMLButtonElement).style.color = "rgba(10,27,57,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = isLastPage ? "rgba(10,27,57,0.15)" : "rgba(10,27,57,0.35)"; }}
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>

      {/* ── FLOATING TOOLBAR ────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 0 16px",
        background: "#F2F2F7",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "white",
          borderRadius: 18,
          boxShadow: "0 2px 12px rgba(10,27,57,0.10), 0 1px 3px rgba(10,27,57,0.06)",
          padding: "5px 6px",
          gap: 2,
        }}>

          <TBtn onClick={prevPage} label="Previous page" disabled={pageNum <= 1}>
            <ChevronLeft size={18} strokeWidth={2} />
          </TBtn>

          <TBtn onClick={nextPage} label="Next page" disabled={isLastPage}>
            <ChevronRight size={18} strokeWidth={2} />
          </TBtn>

          <TSep />

          <TBtn onClick={() => { }} label="Thumbnail view">
            <LayoutGrid size={16} strokeWidth={2} />
          </TBtn>

          <TSep />

          <TBtn onClick={handleZoomIn} label="Zoom in" disabled={zoom >= 200}>
            <ZoomIn size={16} strokeWidth={2} />
          </TBtn>

          <TBtn onClick={handleZoomOut} label="Zoom out" disabled={zoom <= 50}>
            <ZoomOut size={16} strokeWidth={2} />
          </TBtn>

          <TSep />

          <TBtn onClick={toggleFullscreen} label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
            {isFullscreen
              ? <Minimize2 size={16} strokeWidth={2} />
              : <Maximize2 size={16} strokeWidth={2} />}
          </TBtn>

          <TSep />

          {/* More */}
          <div ref={moreRef} style={{ position: "relative" }}>
            <TBtn
              onClick={() => setShowMore((s) => !s)}
              label="More options"
              active={showMore}
            >
              <MoreHorizontal size={17} strokeWidth={2} />
            </TBtn>

            {showMore && (
              <div style={{
                position: "absolute",
                bottom: "calc(100% + 10px)",
                right: 0,
                background: "white",
                borderRadius: 14,
                boxShadow: "0 4px 24px rgba(10,27,57,0.13), 0 1px 4px rgba(10,27,57,0.06)",
                border: "1px solid #F0F0F5",
                overflow: "hidden",
                width: 176,
                padding: "4px 0",
                zIndex: 50,
              }}>
                {[
                  {
                    Icon: ChevronsLeft,
                    label: "First page",
                    action: () => {
                      setSlideDir("right");
                      setAnimKey((k) => k + 1);
                      setPageNum(1);
                      setShowMore(false);
                    },
                  },
                  {
                    Icon: ChevronsRight,
                    label: isPreview ? "Last preview page" : "Last page",
                    action: () => {
                      if (effectiveLastPage) {
                        setSlideDir("left");
                        setAnimKey((k) => k + 1);
                        setPageNum(effectiveLastPage);
                      }
                      setShowMore(false);
                    },
                  },
                ].map(({ Icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      gap: 10, padding: "10px 16px",
                      fontSize: 13, fontWeight: 500,
                      color: "#676E85", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F8F8FB"; (e.currentTarget as HTMLButtonElement).style.color = "#0A1B39"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#676E85"; }}
                  >
                    <Icon size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
                    {label}
                  </button>
                ))}
                <div style={{ height: 1, background: "#F0F0F5", margin: "3px 12px" }} />
                <button
                  onClick={() => { setZoom(100); setShowMore(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    gap: 10, padding: "10px 16px",
                    fontSize: 13, fontWeight: 500,
                    color: "#676E85", background: "none", border: "none",
                    cursor: "pointer", textAlign: "left",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F8F8FB"; (e.currentTarget as HTMLButtonElement).style.color = "#0A1B39"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#676E85"; }}
                >
                  <X size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
                  Reset zoom
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        /* ── Shimmer ── */
        .shimmer {
          animation: shimmer 1.4s ease-in-out infinite;
          background: linear-gradient(90deg, #F0F0F0 25%, #E8E8E8 50%, #F0F0F0 75%) !important;
          background-size: 200% 100% !important;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Page slide animations ── */
        .page-slide-left {
          animation: slideInLeft 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .page-slide-right {
          animation: slideInRight 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Preview paywall animations ── */
        .preview-paywall-enter {
          animation: paywallFadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .preview-paywall-card {
          animation: paywallCardSlide 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }
        @keyframes paywallFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes paywallCardSlide {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── react-pdf layer resets ── */
        .react-pdf__Page__textContent {
          user-select: none;
          pointer-events: none;
        }
        .react-pdf__Page__annotations {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

/* ── Toolbar button ── */
function TBtn({
  onClick, label, children, disabled, active,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#F0F0F5" : "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "#C8C8D0" : active ? "#0A1B39" : "#676E85",
        transition: "background 0.12s, color 0.12s",
        flexShrink: 0,
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.background = "#F0F0F5";
          (e.currentTarget as HTMLButtonElement).style.color = "#0A1B39";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.background = active ? "#F0F0F5" : "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = active ? "#0A1B39" : "#676E85";
        }
      }}
    >
      {children}
    </button>
  );
}

/* ── Separator ── */
function TSep() {
  return (
    <div style={{
      width: 1,
      height: 20,
      background: "#EBEBF0",
      flexShrink: 0,
      margin: "0 2px",
    }} />
  );
}