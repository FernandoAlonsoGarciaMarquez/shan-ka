'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { ActiveItemState, InteractionMode } from '@/app/components/hover_card/types';

interface HoverPopupContextValue {
  activeItem: ActiveItemState | null;
  scheduleOpen: (
    id: string | number,
    anchorEl: HTMLElement,
    content: ReactNode,
    mode: InteractionMode
  ) => void;
  openImmediately: (
    id: string | number,
    anchorEl: HTMLElement,
    content: ReactNode,
    mode: InteractionMode
  ) => void;
  cancelOpen: () => void;
  scheduleClose: () => void;
  cancelClose: () => void;
  closeImmediately: () => void;
}

const HoverPopupContext = createContext<HoverPopupContextValue | null>(null);

const OPEN_DELAY_MS = 300;
const CLOSE_DELAY_MS = 100;

export function HoverPopupProvider({
  children,
  openDelayMs = OPEN_DELAY_MS,
  closeDelayMs = CLOSE_DELAY_MS,
}: {
  children: ReactNode;
  openDelayMs?: number;
  closeDelayMs?: number;
}) {
  const [activeItem, setActiveItem] = useState<ActiveItemState | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const openTimerRef = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const cancelOpen = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const closeImmediately = useCallback(() => {
    cancelClose();
    cancelOpen();
    setActiveItem(null);
  }, [cancelClose, cancelOpen]);

  const scheduleClose = useCallback(() => {
    // курсор ушёл раньше, чем истёк таймер открытия — попап так и не откроется
    cancelOpen();
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setActiveItem(null);
    }, closeDelayMs);
  }, [cancelOpen, cancelClose, closeDelayMs]);

  const openImmediately = useCallback(
    (
      id: string | number,
      anchorEl: HTMLElement,
      content: ReactNode,
      mode: InteractionMode
    ) => {
      cancelOpen();
      cancelClose();
      setActiveItem({ id, anchorEl, content, interactionMode: mode });
    },
    [cancelOpen, cancelClose]
  );

  const scheduleOpen = useCallback(
    (
      id: string | number,
      anchorEl: HTMLElement,
      content: ReactNode,
      mode: InteractionMode
    ) => {
      // если уже открыт другой (или тот же) элемент — переключаемся сразу,
      // задержка открытия нужна только когда попап ещё закрыт
      cancelClose();

      setActiveItem((current) => {
        if (current !== null) {
          cancelOpen();
          return { id, anchorEl, content, interactionMode: mode };
        }
        return current;
      });

      cancelOpen();
      openTimerRef.current = window.setTimeout(() => {
        openTimerRef.current = null;
        setActiveItem({ id, anchorEl, content, interactionMode: mode });
      }, openDelayMs);
    },
    [cancelClose, cancelOpen, openDelayMs]
  );

  const value = useMemo<HoverPopupContextValue>(
    () => ({
      activeItem,
      scheduleOpen,
      openImmediately,
      cancelOpen,
      scheduleClose,
      cancelClose,
      closeImmediately,
    }),
    [
      activeItem,
      scheduleOpen,
      openImmediately,
      cancelOpen,
      scheduleClose,
      cancelClose,
      closeImmediately,
    ]
  );

  return (
    <HoverPopupContext.Provider value={value}>
      {children}
    </HoverPopupContext.Provider>
  );
}

export function useHoverPopupContext(): HoverPopupContextValue {
  const ctx = useContext(HoverPopupContext);
  if (!ctx) {
    throw new Error(
      'useHoverPopupContext должен использоваться внутри <HoverPopup>'
    );
  }
  return ctx;
}