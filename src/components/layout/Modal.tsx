import React, { useEffect } from "react";
import Container from "./Container";
import Button from "../common/Button";
import { PiMarkerCircleDuotone } from "react-icons/pi";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  width?: string; // Tailwind width class, e.g. "max-w-md"
}

const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  width = "max-w-md",
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className={`w-full ${width} bg-white rounded-xl shadow-2xl p-6 relative`}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <Button
          onClick={onClose}
          size="sm"
          variant="pry"
          className="absolute right-4 top-4 p-2"
          aria-label="Close modal"
        >
          <PiMarkerCircleDuotone className="w-5 h-5 text-neutral-600" />
        </Button>

        <Container>
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold mb-1">
              {title}
            </h2>
          )}
          {description && (
            <p id="modal-description" className="text-sm text-neutral-600 mb-4">
              {description}
            </p>
          )}

          <div className="space-y-3">{children}</div>
        </Container>
      </div>
    </div>
  );
};

export default BaseModal;