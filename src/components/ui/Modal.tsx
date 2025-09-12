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
      className={`modal fixed z-[99999] inset-0 flex items-end md:items-center justify-center bg-[rgba(0,_0,_0,_0.70)] *:transition-all !duration-300 ${overlayOpacityClass} ${className}`}
      onClick={handleCloseModal}
      aria-hidden={!openModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`w-full md:max-w-3xl bg-transparent md:bg-transparent p-0 md:p-0 relative`}
      >
        <span
          className="icon-x absolute top-9 right-10 cursor-pointer text-base-3 text-lg z-[5] w-6 h-6 flex items-center justify-center"
          onClick={handleCloseModal}
          onTouchEnd={handleCloseModal}
        ></span>
        <div
          className={`pointer-events-auto bg-[rgba(21,_20,_17,_0.70)] backdrop-blur-xl md:rounded-lg shadow-lg mx-auto max-w-full md:my-8 transform *:transition-all !duration-300 ${panelTransformClass}`}
          style={{
            // on mobile occupy most of width and height; on desktop allow content to size itself
            width: "100%",
            maxWidth: 920,
            height: "auto",
            margin: 0,
          }}
        >
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};
