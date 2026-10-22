import type { AnchorRect, PopupLayout } from '@/app/components/hover_card/types';

const GAP = 8;
const VIEWPORT_PADDING = 8;
// const GAP = 0;
// const VIEWPORT_PADDING = 0;

export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function getAnchorRect(el: HTMLElement): AnchorRect {
  const rect = el.getBoundingClientRect();
  // const top_munused_fck = rect.top - rect.height
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

export function calculatePopupPosition(
  anchorRect: AnchorRect,
  popupSize: { width: number; height: number },
  gap: number = GAP
): PopupLayout {
  const viewport = getViewportSize();

  // --- вертикаль: снизу или сверху ---
  const spaceBelow = viewport.height - anchorRect.bottom;
  const spaceAbove = anchorRect.top;

  let vertical: PopupLayout['placement']['vertical'];
  let top: number;

//   if (spaceBelow >= popupSize.height + gap || spaceBelow >= spaceAbove) {
//     vertical = 'bottom';
//     top = anchorRect.bottom + gap;
//   } else {
//     vertical = 'top';
//     top = anchorRect.top - popupSize.height - gap;
//   }

    if (spaceBelow >= popupSize.height + gap || spaceBelow >= spaceAbove) {
        vertical = 'bottom';
        top = (anchorRect.top + (anchorRect.height/2)) - (popupSize.height/2);
    } else {
        vertical = 'top';
        top = (anchorRect.top + (anchorRect.height/2)) - (popupSize.height/2);
    }

  const maxTop = Math.max(
    viewport.height - popupSize.height - VIEWPORT_PADDING,
    VIEWPORT_PADDING
  );
  top = Math.min(Math.max(top, VIEWPORT_PADDING), maxTop);

  // --- горизонталь: справа или слева ---
  const spaceRight = viewport.width - anchorRect.left;
  const spaceLeft = anchorRect.right;

  let horizontal: PopupLayout['placement']['horizontal'];
  let left: number;

    if (spaceRight >= popupSize.width || spaceRight >= spaceLeft) {
        horizontal = 'right';
        left = (anchorRect.left + (anchorRect.width/2)) - (popupSize.width/2);
    } else {
        horizontal = 'left';
        left = (anchorRect.right + (anchorRect.width/2)) - (popupSize.width/2);
    }

//   if (spaceRight >= popupSize.width || spaceRight >= spaceLeft) {
//     horizontal = 'right';
//     left = anchorRect.left;
//   } else {
//     horizontal = 'left';
//     left = anchorRect.right - popupSize.width;
//   }

  const maxLeft = Math.max(
    viewport.width - popupSize.width - VIEWPORT_PADDING,
    VIEWPORT_PADDING
  );
  left = Math.min(Math.max(left, VIEWPORT_PADDING), maxLeft);

  return {
    position: { top, left },
    placement: { vertical, horizontal },
  };
}