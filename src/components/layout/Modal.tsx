import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "devign";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  width?: string; // Tailwind width class, e.g. "max-w-md"
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  width = "max-w-md",
  closeOnOutsideClick = true,
  closeOnEscape = true,
}) => {
  const handleOpenChange = (v: boolean) => {
    if (!v) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={closeOnOutsideClick || closeOnEscape ? handleOpenChange : undefined}>
      <DialogContent
        className={`${width}`}
        onPointerDownOutside={closeOnOutsideClick ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className="space-y-3">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
