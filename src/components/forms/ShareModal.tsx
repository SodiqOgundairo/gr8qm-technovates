import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiClipboardCopy, HiDownload } from "react-icons/hi";
import Button from "../common/Button";
import ShortUrlGenerator from "./ShortUrlGenerator";

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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-oxford">Share Form</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
