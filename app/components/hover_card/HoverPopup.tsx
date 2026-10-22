'use client';

import type { ReactNode } from 'react';
import { HoverPopupProvider } from '@/app/components/hover_card/HoverPopupContext';
import { HoverPopupPortal } from '@/app/components/hover_card/HoverPopupPortal';

export interface HoverPopupProps {



  children: ReactNode;
  /** Задержка перед открытием попапа при наведении, мс (по умолчанию 200) */
  openDelayMs?: number;
  /** Задержка перед закрытием попапа после ухода мыши, мс (по умолчанию 100) */
  closeDelayMs?: number;
}

/**
 * Оборачивает список, элементы которого используют useHoverPopupTrigger.
 * Рендерит один-единственный портал попапа на весь список — оборачивать
 * нужно один раз вокруг всего списка, а не вокруг каждого элемента.
 */
export function HoverPopup({ children, openDelayMs, closeDelayMs  }: HoverPopupProps) {
  return (
    <HoverPopupProvider openDelayMs={openDelayMs} closeDelayMs={closeDelayMs}

    
    >
      {children}
      <HoverPopupPortal />
    </HoverPopupProvider>
  );
}