'use client';

import { useCallback, useEffect, useRef } from 'react';
// import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { useHoverPopupContext } from '@/app/components/hover_card/HoverPopupContext';

export interface UseHoverPopupTriggerResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  isActive: boolean;
  handlers: {
    onPointerEnter: (event: ReactPointerEvent<T>) => void;
    onPointerLeave: (event: ReactPointerEvent<T>) => void;
    onPointerUp: (event: ReactPointerEvent<T>) => void;
    onClick: (event: ReactMouseEvent<T>) => void;
  };
}

export function useHoverPopupTrigger<T extends HTMLElement = HTMLElement>(
  id: string | number,
  content: ReactNode
): UseHoverPopupTriggerResult<T> {


//   const { activeItem, openItem, scheduleClose, cancelClose, closeImmediately } =
//     useHoverPopupContext();

    const {
    activeItem,
    scheduleOpen,
    openImmediately,
    cancelOpen,
    scheduleClose,
    cancelClose,
    closeImmediately,
    } = useHoverPopupContext();

  const ref = useRef<T | null>(null);
  const isActive = activeItem?.id === id;

  // всегда актуальный id активного попапа — нужен внутри cleanup-функции
  // при размонтировании, чтобы не читать устаревшее значение из замыкания
  const activeIdRef = useRef(activeItem?.id);
  activeIdRef.current = activeItem?.id;

const onPointerEnter = useCallback(
  (event: ReactPointerEvent<T>) => {
    if (event.pointerType !== 'mouse') return;
    if (!ref.current) return;
    scheduleOpen(id, ref.current, content, 'mouse');
  },
  [id, content, scheduleOpen]
);

const onPointerLeave = useCallback(
  (event: ReactPointerEvent<T>) => {
    if (event.pointerType !== 'mouse') return;
    scheduleClose();
  },
  [scheduleClose]
);

const onPointerUp = useCallback(
  (event: ReactPointerEvent<T>) => {
    if (event.pointerType === 'mouse') return;
    if (!ref.current) return;

    if (activeItem?.id === id) {
      closeImmediately();
      return;
    }
    openImmediately(id, ref.current, content, 'touch');
  },
  [id, content, activeItem, openImmediately, closeImmediately]
);

// клик мышью — открыть попап мгновенно, без задержки, независимо от hover-таймера
  const onClick = useCallback(
    (event: ReactMouseEvent<T>) => {
      if (!ref.current) return;
      const mode: 'mouse' | 'touch' =
        event.detail === 0 && (event.nativeEvent as PointerEvent).pointerType
          ? ((event.nativeEvent as PointerEvent).pointerType as 'mouse' | 'touch')
          : 'mouse';

      if (activeItem?.id === id) {
        closeImmediately();
        return;
      }
      openImmediately(id, ref.current, content, mode === 'touch' ? 'touch' : 'mouse');
    },
    [id, content, activeItem, openImmediately, closeImmediately]
  );


//   const onPointerEnter = useCallback(
//     (event: ReactPointerEvent<T>) => {
//       if (event.pointerType !== 'mouse') return;
//       if (!ref.current) return;
//       cancelClose();
//       openItem(id, ref.current, content, 'mouse');
//     },
//     [id, content, cancelClose, openItem]
//   );

//   const onPointerLeave = useCallback(
//     (event: ReactPointerEvent<T>) => {
//       if (event.pointerType !== 'mouse') return;
//       scheduleClose();
//     },
//     [scheduleClose]
//   );

//   const onPointerUp = useCallback(
//     (event: ReactPointerEvent<T>) => {
//       if (event.pointerType === 'mouse') return;
//       if (!ref.current) return;

//       if (activeItem?.id === id) {
//         closeImmediately();
//         return;
//       }
//       openItem(id, ref.current, content, 'touch');
//     },
//     [id, content, activeItem, openItem, closeImmediately]
//   );

  // если элемент размонтируется, пока его попап открыт — закрываем сразу,
  // чтобы popup не остался привязан к удалённому из DOM anchorEl
  useEffect(() => {
    return () => {
      if (activeIdRef.current === id) {
        closeImmediately();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    ref,
    isActive,
    handlers: { 
        onPointerEnter, 
        onPointerLeave, 
        onPointerUp, 
        onClick },
  };
}