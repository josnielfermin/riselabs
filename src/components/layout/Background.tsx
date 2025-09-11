"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export const Background = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, baseTx: 0, baseTy: 0 });
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const clamp = (v: number, a: number, b: number) =>
      Math.max(a, Math.min(b, v));

    const pickTarget = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const imgW = 1521.233;
      const imgH = 942.691;

      const minSide = 300;
      const maxSide = 600;
      const minBottom = 400;
      const maxBottom = 500;

      // Choose vertical position (bias to bottom)
      let baseTy: number;
      if (Math.random() < 0.75) {
        // bottom: keep offscreen by 400-500px (positive y moves it further down)
        const off = minBottom + Math.random() * (maxBottom - minBottom);
        baseTy = off; // since bottom:0, positive moves further offscreen below
      } else {
        // top: keep offscreen by 300-600px
        const off = minSide + Math.random() * (maxSide - minSide);
        // topEdge = vh - imgH + ty -> want topEdge = -off => ty = -off - (vh - imgH)
        baseTy = -off - (vh - imgH);
      }

      // Choose horizontal position (left or right)
      let baseTx: number;
      if (Math.random() < 0.5) {
        // right: keep offscreen by 300-600px (positive x moves it further right)
        const off = minSide + Math.random() * (maxSide - minSide);
        baseTx = off; // right:0 anchor
      } else {
        // left: keep offscreen by 300-600px
        const off = minSide + Math.random() * (maxSide - minSide);
        // leftEdge = vw - imgW + tx -> want leftEdge = -off => tx = -off - (vw - imgW)
        baseTx = -off - (vw - imgW);
      }

      // set base targets and current targets
      stateRef.current.baseTx = baseTx;
      stateRef.current.baseTy = baseTy;
      stateRef.current.tx = baseTx;
      stateRef.current.ty = baseTy;

      // pick a new target every 8-16s
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

      // base targets
      const baseTx = stateRef.current.baseTx ?? stateRef.current.tx;
      const baseTy = stateRef.current.baseTy ?? stateRef.current.ty;

      // start from base and apply a modest push away from cursor
      const dxCenter = cx - vw / 2;
      const dyCenter = cy - vh / 2;
      const dist = Math.hypot(dxCenter, dyCenter);
      const closeness = Math.max(0, 1 - dist / 600);

      const pushMax = 200; // initial push
      const biasX = (dxCenter > 0 ? -1 : 1) * pushMax * closeness;
      const biasY = (dyCenter > 0 ? -1 : 1) * pushMax * closeness;

      let txCandidate = baseTx + biasX;
      let tyCandidate = baseTy + biasY;

      // helper: compute visible rect for given tx/ty
      const visibleRect = (tx: number, ty: number) => {
        const left = vw - imgW + tx;
        const top = vh - imgH + ty;
        const right = left + imgW;
        const bottom = top + imgH;
        return { left, top, right, bottom };
      };

      // clamp ranges used previously
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

      // If the mouse would be inside the visible rect, push further until it's outside
      const margin = 20; // extra gap beyond the cursor
      let rect = visibleRect(txCandidate, tyCandidate);
      if (
        cx >= rect.left &&
        cx <= rect.right &&
        cy >= rect.top &&
        cy <= rect.bottom
      ) {
        // horizontal push
        if (cx > rect.left + imgW / 2) {
          // push to the right
          const needed = rect.right - cx + margin;
          txCandidate += needed;
        } else {
          // push to the left
          const needed = cx - rect.left + margin;
          txCandidate -= needed;
        }

        // recompute rect after horizontal push
        rect = visibleRect(txCandidate, tyCandidate);

        // vertical push
        if (cy > rect.top + imgH / 2) {
          // push down
          const needed = rect.bottom - cy + margin;
          tyCandidate += needed;
        } else {
          // push up
          const needed = cy - rect.top + margin;
          tyCandidate -= needed;
        }
      }

      // finally clamp to allowed offscreen ranges
      txCandidate = clampHorizontal(txCandidate, baseTx);
      tyCandidate = clampVertical(tyCandidate, baseTy);

      stateRef.current.tx = txCandidate;
      stateRef.current.ty = tyCandidate;
    };

    const animate = () => {
      const s = stateRef.current;
      // Smoothly interpolate (lerp) towards target — small factor for slow motion
      s.x += (s.tx - s.x) * 0.02; // slightly faster than 0.01
      s.y += (s.ty - s.y) * 0.02;

      el.style.transform = `translate(${s.x}px, ${s.y}px)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    // start
    pickTarget();
    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 right-0 max-md:hidden pointer-events-none select-none will-change-transform z-[-1]"
      style={{ transform: "translate(0px, 0px)" }}
    >
      <Image
        src="/static/images/bg-decorator.png"
        alt=""
        width={1521.233}
        height={942.691}
        priority={false}
      />
    </div>
  );
};
