'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHoverPopupContext } from '@/app/components/hover_card/HoverPopupContext';
import { calculatePopupPosition, getAnchorRect } from '@/app/components/hover_card/positioning';
import type { PopupLayout } from '@/app/components/hover_card/types';

export function HoverPopupPortal() {
  const { activeItem, cancelClose, scheduleClose, closeImmediately } =
    useHoverPopupContext();

  const popupRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [layout, setLayout] = useState<PopupLayout | null>(null);

  const recalcPosition = useCallback(() => {
    if (!activeItem || !popupRef.current) return;
    const anchorRect = getAnchorRect(activeItem.anchorEl);

    // console.log("HoverPopupPortal, anchorRect: ", anchorRect);
    // ----------------------------------------lalalallalalalalallala ---------------------

    const popupRect = popupRef.current.getBoundingClientRect();
    const nextLayout = calculatePopupPosition(anchorRect, {
      width: popupRect.width,
      height: popupRect.height,
    });
    setLayout(nextLayout);
  }, [activeItem]);

  // измеряем и позиционируем попап при каждой смене активного элемента
  useLayoutEffect(() => {
    if (!activeItem) {
      setLayout(null);
      return;
    }
    recalcPosition();
  }, [activeItem, recalcPosition]);

  // пересчёт позиции при скролле/ресайзе, throttled через requestAnimationFrame;
  // подписка живёт ровно столько, сколько открыт попап
  useEffect(() => {
    if (!activeItem) return;

    const handleViewportChange = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        recalcPosition();
      });
    };

    window.addEventListener('scroll', handleViewportChange, {
      capture: true,
      passive: true,
    });
    window.addEventListener('resize', handleViewportChange, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleViewportChange, true);
      window.removeEventListener('resize', handleViewportChange);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [activeItem, recalcPosition]);

  // если размер контента попапа меняется сам по себе (например, догрузилась
  // картинка) — пересчитываем позицию, чтобы попап не выехал за viewport
  useEffect(() => {
    if (!activeItem || !popupRef.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      recalcPosition();
    });
    observer.observe(popupRef.current);

    return () => observer.disconnect();
  }, [activeItem, recalcPosition]);

  // закрытие по тапу вне popup/anchor — актуально только для touch-режима
  useEffect(() => {
    if (!activeItem || activeItem.interactionMode !== 'touch') return;

    const handleOutsideInteraction = (event: PointerEvent) => {
      const target = event.target as Node;
      const popupEl = popupRef.current;
      const anchorEl = activeItem.anchorEl;
      if (popupEl?.contains(target) || anchorEl.contains(target)) return;
      closeImmediately();
    };

    document.addEventListener('pointerdown', handleOutsideInteraction, true);
    return () =>
      document.removeEventListener('pointerdown', handleOutsideInteraction, true);
  }, [activeItem, closeImmediately]);

  if (!activeItem) return null;

  return createPortal(
    <div
      ref={popupRef}
      data-placement-vertical={layout?.placement.vertical}
      data-placement-horizontal={layout?.placement.horizontal}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return;
        cancelClose();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return;
        scheduleClose();
      }}
      style={{
        position: 'fixed',
        top: layout?.position.top ?? 0,
        left: layout?.position.left ?? 0,
        visibility: layout ? 'visible' : 'hidden',
        zIndex: 2147483647,
        pointerEvents: 'auto',
      }}
    >
      {activeItem.content}
    </div>,
    document.body
  );
}