import type { ReactNode } from 'react';

export interface Position {
  top: number;
  left: number;
}

export type VerticalPlacement = 'bottom' | 'top';
export type HorizontalPlacement = 'right' | 'left';

export interface PopupPlacement {
  vertical: VerticalPlacement;
  horizontal: HorizontalPlacement;
}

export interface AnchorRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export type InteractionMode = 'mouse' | 'touch';

export interface ActiveItemState {
  id: string | number;
  anchorEl: HTMLElement;
  content: ReactNode;
  interactionMode: InteractionMode;
}

export interface PopupLayout {
  position: Position;
  placement: PopupPlacement;
}