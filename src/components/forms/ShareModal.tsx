import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { HiClipboardCopy, HiDownload } from "react-icons/hi";
import Button from "../common/Button";
import ShortUrlGenerator from "./ShortUrlGenerator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "devign";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  formTitle: string;
  shareUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  formId,
  formTitle,
  shareUrl: initialShareUrl,
}) => {
  const [shareUrl, setShareUrl] = useState(initialShareUrl);
  const [shortCode, setShortCode] = useState("");

  // Extract short code from initial URL if possible
  useEffect(() => {
    setShareUrl(initialShareUrl);
    const parts = initialShareUrl.split("/");
    const code = parts[parts.length - 1];
    if (code && code !== formId) {
      setShortCode(code);
    }
  }, [initialShareUrl, formId]);

  const handleShortCodeUpdate = (code: string) => {
    setShortCode(code);
    setShareUrl(`${window.location.origin}/forms/${code}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${formTitle.replace(/\s+/g, "_")}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:!max-w-md">
        <DialogHeader>
          <DialogTitle>Share Form</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Share Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
              />
              <Button variant="sec" onClick={handleCopy} title="Copy Link">
                <HiClipboardCopy className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Short URL Generator */}
          <ShortUrlGenerator
            formId={formId}
            currentShortCode={shortCode}
            onShortCodeUpdate={handleShortCodeUpdate}
          />

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <QRCodeSVG
                id="qr-code-svg"
                value={shareUrl}
                size={180}
                level="H"
                includeMargin
              />
            </div>
            <Button
              variant="pry"
              onClick={handleDownloadQR}
              className="flex items-center gap-2 text-sm"
            >
              <HiDownload className="h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
