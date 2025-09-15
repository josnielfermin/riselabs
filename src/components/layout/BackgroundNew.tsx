"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export const Background = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    baseTx: 0,
    baseTy: 0,
    r: 0,
    tr: 0,
    baseTr: 0,
  });
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const clamp = (v: number, a: number, b: number) =>
      Math.max(a, Math.min(b, v));

    let started = false;

    const start = () => {
      if (started) return;
      started = true;

      const el = containerRef.current;
      if (!el) return;

      const pickTarget = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const imgW = 1521.233;
        const imgH = 942.691;

        const minSide = 300;
        const maxSide = 600;
        const minBottom = 400;
        const maxBottom = 500;

        // If mobile: pin to bottom so only ~250px of image is visible and disable rotation/mouse
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (isMobile) {
          const baseTy = imgH - 250; // visible top = vh - 250
          const baseTx = 0; // keep right-aligned
          stateRef.current.baseTx = baseTx;
          stateRef.current.baseTy = baseTy;
          stateRef.current.tx = baseTx;
          stateRef.current.ty = baseTy;
          stateRef.current.baseTr = 0;
          stateRef.current.tr = 0;
          // pick again later to keep stable but allow small timing
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(
            pickTarget,
            8000 + Math.random() * 8000
          );
          return;
        }

        // desktop/tablet behavior (existing randomization)
        // Choose vertical position (bias to bottom)
        let baseTy: number;
        if (Math.random() < 0.75) {
          const off = minBottom + Math.random() * (maxBottom - minBottom);
          baseTy = off;
        } else {
          const off = minSide + Math.random() * (maxSide - minSide);
          baseTy = -off - (vh - imgH);
        }

        // Choose horizontal position (left or right)
        let baseTx: number;
        if (Math.random() < 0.5) {
          const off = minSide + Math.random() * (maxSide - minSide);
          baseTx = off;
        } else {
          const off = minSide + Math.random() * (maxSide - minSide);
          baseTx = -off - (vw - imgW);
        }

        stateRef.current.baseTx = baseTx;
        stateRef.current.baseTy = baseTy;
        stateRef.current.tx = baseTx;
        stateRef.current.ty = baseTy;

        const minRot = -20;
        const maxRot = 20;
        const tr = minRot + Math.random() * (maxRot - minRot);
        stateRef.current.baseTr = tr;
        stateRef.current.tr = tr;

        if (timerRef.current) clearTimeout(timerRef.current);
        const nextMs = 8000 + Math.random() * 8000;
        timerRef.current = window.setTimeout(pickTarget, nextMs);
      };

      const onMove = (e: MouseEvent) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const imgW = 1521.233;
        const imgH = 942.691;

        const cx = e.clientX;
        const cy = e.clientY;

        const baseTx = stateRef.current.baseTx ?? stateRef.current.tx;
        const baseTy = stateRef.current.baseTy ?? stateRef.current.ty;

        const dxCenter = cx - vw / 2;
        const dyCenter = cy - vh / 2;
        const dist = Math.hypot(dxCenter, dyCenter);
        const closeness = Math.max(0, 1 - dist / 600);

        const pushMax = 200;
        const biasX = (dxCenter > 0 ? -1 : 1) * pushMax * closeness;
        const biasY = (dyCenter > 0 ? -1 : 1) * pushMax * closeness;

        let txCandidate = baseTx + biasX;
        let tyCandidate = baseTy + biasY;

        const visibleRect = (tx: number, ty: number) => {
          const left = vw - imgW + tx;
          const top = vh - imgH + ty;
          const right = left + imgW;
          const bottom = top + imgH;
          return { left, top, right, bottom };
        };

        const minSide = 300;
        const maxSide = 600;
        const minBottom = 400;
        const maxBottom = 500;

        const clampHorizontal = (tx: number, baseTxVal: number) => {
          if (baseTxVal >= 0) return clamp(tx, minSide, maxSide);
          const leftMin = -maxSide - (vw - imgW);
          const leftMax = -minSide - (vw - imgW);
          return clamp(tx, leftMin, leftMax);
        };

        const clampVertical = (ty: number, baseTyVal: number) => {
          if (baseTyVal >= 0) return clamp(ty, minBottom, maxBottom);
          const topMin = -maxSide - (vh - imgH);
          const topMax = -minSide - (vh - imgH);
          return clamp(ty, topMin, topMax);
        };

        const margin = 20;
        let rect = visibleRect(txCandidate, tyCandidate);
        if (
          cx >= rect.left &&
          cx <= rect.right &&
          cy >= rect.top &&
          cy <= rect.bottom
        ) {
          if (cx > rect.left + imgW / 2) {
            const needed = rect.right - cx + margin;
            txCandidate += needed;
          } else {
            const needed = cx - rect.left + margin;
            txCandidate -= needed;
          }

          rect = visibleRect(txCandidate, tyCandidate);

          if (cy > rect.top + imgH / 2) {
            const needed = rect.bottom - cy + margin;
            tyCandidate += needed;
          } else {
            const needed = cy - rect.top + margin;
            tyCandidate -= needed;
          }
        }

        txCandidate = clampHorizontal(txCandidate, baseTx);
        tyCandidate = clampVertical(tyCandidate, baseTy);

        stateRef.current.tx = txCandidate;
        stateRef.current.ty = tyCandidate;
      };

      const animate = () => {
        const s = stateRef.current;
        s.x += (s.tx - s.x) * 0.02;
        s.y += (s.ty - s.y) * 0.02;
        s.r += (s.tr - s.r) * 0.02;

        el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`;

        rafRef.current = requestAnimationFrame(animate);
      };

      // start
      pickTarget();
      rafRef.current = requestAnimationFrame(animate);
      window.addEventListener("mousemove", onMove, { passive: true });

      // cleanup function used when stopping
      const stop = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (timerRef.current) clearTimeout(timerRef.current);
        window.removeEventListener("mousemove", onMove);
      };

      // store stop on ref so outer cleanup can call it
      (start as any).stop = stop;
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      // if started, call the stop function saved on start
      if ((start as any).stop) (start as any).stop();
      else window.removeEventListener("load", start as any);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 right-0 max-md:hidden pointer-events-none touch-none select-none will-change-transform z-[-1]"
      style={{ transform: "translate(0px, 0px)" }}
    >
      {/* <Image
        src="/static/images/bg-decorator.png"
        alt=""
        width={1521.233}
        height={942.691}
        priority={false}
      /> */}
      <Image
        src="/static/images/bg-decorator-big2.png"
        alt=""
        width={3863}
        height={2934}
        priority={true}
        className="rounded-full"
      />
    </div>
  );
};
