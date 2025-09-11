"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  openModal: boolean;
  className?: string;
  persist?: boolean;
  setOpenModal: (openModal: boolean) => void;
}

export const Modal = ({
  children,
  openModal,
  className = "",
  setOpenModal,
  persist = false,
}: ModalProps) => {
  const [mounted, setMounted] = useState(openModal);

  useEffect(() => {
    if (openModal) setMounted(true);
    else {
      // wait for animation to finish before unmounting
      const t = window.setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [openModal]);

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openModal]);

  useEffect(() => {
    if (!persist) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpenModal(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
    return;
  }, [persist, setOpenModal]);

  if (!mounted) return null;

  const handleCloseModal = () => {
    if (!persist) {
      setOpenModal(false);
    }
  };

  // panel slides from bottom on small screens; on larger screens it's centered (fallback)
  const panelTransformClass = openModal ? "translate-y-0" : "translate-y-full";
  const overlayOpacityClass = openModal ? "opacity-100" : "opacity-0";

  return ReactDOM.createPortal(
    <div
      id="modal"
      className={`modal fixed z-[99999] inset-0 flex items-end sm:items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ${overlayOpacityClass} ${className}`}
      onClick={handleCloseModal}
      aria-hidden={!openModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`w-full sm:max-w-3xl bg-transparent sm:bg-transparent p-0 sm:p-0 pointer-events-none`}
      >
        <div
          className={`pointer-events-auto bg-[#0b0b0b] border border-gray-800 rounded-t-lg sm:rounded-lg shadow-lg mx-auto max-w-full sm:my-8 transform transition-transform duration-300 ${panelTransformClass}`}
          style={{
            // on mobile occupy most of width and height; on desktop allow content to size itself
            width: "100%",
            maxWidth: 920,
            height: "auto",
            margin: 0,
          }}
        >
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};
