"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Upload, ZoomIn, ZoomOut, Check, Trash2, Info, Image as ImageIcon } from "lucide-react";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhotoUrl?: string;
  initialShape?: "circle" | "square" | "rounded";
  initialSize?: "small" | "medium" | "large";
  onSave: (data: {
    photoUrl: string;
    showPhoto: boolean;
    photoShape: "circle" | "square" | "rounded";
    photoSize: "small" | "medium" | "large";
  }) => void;
  onRemove: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  initialPhotoUrl = "",
  initialShape = "circle",
  initialSize = "medium",
  onSave,
  onRemove,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(initialPhotoUrl);
  const [shape, setShape] = useState<"circle" | "square" | "rounded">(initialShape);
  const [size, setSize] = useState<"small" | "medium" | "large">(initialSize);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [errorMsg, setErrorMsg] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setPhotoUrl(initialPhotoUrl);
      setShape(initialShape);
      setSize(initialSize);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setErrorMsg("");
    }
  }, [isOpen, initialPhotoUrl, initialShape, initialSize]);

  // Draw on canvas whenever pan, zoom, or shape changes
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background fill
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    // Clip to desired shape in the center (target 240x240 preview)
    const boxSize = 220;
    const boxX = (width - boxSize) / 2;
    const boxY = (height - boxSize) / 2;

    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(width / 2, height / 2, boxSize / 2, 0, Math.PI * 2);
    } else if (shape === "rounded") {
      const radius = 24;
      ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
    } else {
      ctx.rect(boxX, boxY, boxSize, boxSize);
    }
    ctx.clip();

    // Draw the scaled and panned image
    const baseScale = Math.max(boxSize / img.naturalWidth, boxSize / img.naturalHeight);
    const scale = baseScale * zoom;
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const drawX = width / 2 - drawW / 2 + pan.x;
    const drawY = height / 2 - drawH / 2 + pan.y;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    // Draw overlay border around crop zone
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#6366f1";
    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(width / 2, height / 2, boxSize / 2, 0, Math.PI * 2);
    } else if (shape === "rounded") {
      ctx.roundRect(boxX, boxY, boxSize, boxSize, 24);
    } else {
      ctx.rect(boxX, boxY, boxSize, boxSize);
    }
    ctx.stroke();
    ctx.restore();
  }, [pan, zoom, shape]);

  // Load image object whenever photoUrl changes
  useEffect(() => {
    if (!photoUrl) {
      imageObjRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageObjRef.current = img;
      drawCanvas();
    };
    img.onerror = () => {
      setErrorMsg("Failed to load image. Please select a valid JPEG, PNG, or WebP.");
    };
    img.src = photoUrl;
  }, [photoUrl, drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
      setErrorMsg("Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotoUrl(result);
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSaveCropped = () => {
    const img = imageObjRef.current;
    if (!img) {
      onClose();
      return;
    }

    // Export a crisp 360x360 compressed square/circle image
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 360;
    exportCanvas.height = 360;
    const ctx = exportCanvas.getContext("2d");

    if (ctx) {
      const boxSize = 360;
      const baseScale = Math.max(boxSize / img.naturalWidth, boxSize / img.naturalHeight);
      const scale = baseScale * zoom;
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      // Map canvas coordinates
      const scaleRatio = 360 / 220;
      const drawX = 180 - drawW / 2 + pan.x * scaleRatio;
      const drawY = 180 - drawH / 2 + pan.y * scaleRatio;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const compressedDataUrl = exportCanvas.toDataURL("image/jpeg", 0.88);

      onSave({
        photoUrl: compressedDataUrl,
        showPhoto: true,
        photoShape: shape,
        photoSize: size,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Professional Headshot</h3>
              <p className="text-xs text-slate-400">Upload, crop, and position your photo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Regional advisory note */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Regional Guidance: </span>
              Photos are standard in mainland Europe, Latin America, and parts of Asia, but generally discouraged on US, UK, and Canadian resumes to prevent unconscious bias. Verify local norms for your target role.
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Canvas or Empty State */}
          <div className="flex flex-col items-center">
            {photoUrl ? (
              <div className="relative group cursor-grab active:cursor-grabbing border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="block touch-none"
                />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full pointer-events-none">
                  Drag to reposition
                </span>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-52 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/40 hover:bg-slate-950 transition-colors"
              >
                <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-200">Click to upload photo</div>
                  <div className="text-[11px] text-slate-500">JPEG, PNG, or WebP (max 5MB)</div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {photoUrl && (
            <>
              {/* Zoom Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <ZoomOut className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </span>
                  <span className="font-mono text-[11px] text-indigo-300">{Math.round(zoom * 100)}%</span>
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Shape Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Photo Shape</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["circle", "rounded", "square"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShape(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                        shape === s
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Display Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["small", "medium", "large"] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                        size === sz
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change photo button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  Choose different image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrl("");
                    onRemove();
                  }}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove photo</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-end gap-2 bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveCropped}
            disabled={!photoUrl}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
