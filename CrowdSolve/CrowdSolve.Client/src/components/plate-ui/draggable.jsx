'use client';;
import React from 'react';

import { cn, withRef } from '@udecode/cn';
import { MemoizedChildren, useEditorPlugin, useEditorRef, withHOC } from '@udecode/plate-common/react';
import {
  DraggableProvider,
  useDraggable,
  useDraggableGutter,
  useDraggableState,
  useDropLine,
} from '@udecode/plate-dnd';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import { GripVertical } from 'lucide-react';

import { useMounted } from '@/hooks/use-mounted';

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

export const Draggable = withHOC(
  DraggableProvider,
  withRef(({ className, onDropHandler, ...props }, ref) => {
    const { children, element } = props;

    const state = useDraggableState({ element, onDropHandler });
    const { isDragging } = state;
    const { previewRef, handleRef } = useDraggable(state);
    const mounted = useMounted();

    return (
      (<div
        ref={ref}
        className={cn('relative', isDragging && 'opacity-50', 'group', className)}>
        <Gutter>
          <div className={cn('slate-blockToolbarWrapper', 'flex h-[1.5em]')}>
            <div
              className={cn('slate-blockToolbar', 'pointer-events-auto mr-1 flex items-center')}>
              <div
                ref={handleRef}
                className="size-4"
                data-key={mounted ? (element.id) : undefined}>
                <DragHandle />
              </div>
            </div>
          </div>
        </Gutter>
        <div ref={previewRef} className="slate-blockWrapper">
          <MemoizedChildren>{children}</MemoizedChildren>

          <DropLine />
        </div>
      </div>)
    );
  })
);

const Gutter = React.forwardRef(({ children, className, ...props }, ref) => {
  const { useOption } = useEditorPlugin(BlockSelectionPlugin);
  const isSelectionAreaVisible = useOption('isSelectionAreaVisible');
  const gutter = useDraggableGutter();

  return (
    (<div
      ref={ref}
      className={cn(
        'slate-gutterLeft',
        'absolute -top-px z-50 flex h-full -translate-x-full cursor-text opacity-0 hover:opacity-100 group-hover:opacity-100',
        isSelectionAreaVisible && 'hidden',
        className
      )}
      {...props}
      {...gutter.props}>
      {children}
    </div>)
  );
});

const DragHandle = React.memo(() => {
  const editor = useEditorRef();

  return (
    (<TooltipProvider>
      <Tooltip>
        <TooltipTrigger type="button">
          <GripVertical
            className="size-4 text-muted-foreground"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onMouseDown={() => {
              editor
                .getApi(BlockSelectionPlugin)
                .blockSelection?.resetSelectedIds();
            }} />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>Drag to move</TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>)
  );
});

const DropLine = React.memo(React.forwardRef(({ children, className, ...props }, ref) => {
  const state = useDropLine();

  if (!state.dropLine) return null;

  return (
    (<div
      ref={ref}
      {...props}
      {...state.props}
      className={cn(
        'slate-dropLine',
        'absolute inset-x-0 h-0.5 opacity-100 transition-opacity',
        'bg-brand/50',
        state.dropLine === 'top' && '-top-px',
        state.dropLine === 'bottom' && '-bottom-px',
        className
      )}>
      {children}
    </div>)
  );
}));
