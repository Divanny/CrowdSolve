'use client';;
import React from 'react';

import { cn } from '@udecode/cn';
import { PlateContent } from '@udecode/plate-common/react';
import { cva } from 'class-variance-authority';

const editorcontainerVariants = cva(
  'relative flex cursor-text [&_.slate-selection-area]:border [&_.slate-selection-area]:border-brand/25 [&_.slate-selection-area]:bg-brand/15',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'w-full',
        demo: 'h-[650px] w-full overflow-y-auto',
      },
    },
  }
);

export const Editorcontainer = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    (<div
      ref={ref}
      className={cn(
        'ignore-click-outside/toolbar',
        editorcontainerVariants({ variant }),
        className
      )}
      role="button"
      {...props} />)
  );
});

Editorcontainer.displayName = 'Editorcontainer';

const editorVariants = cva(cn(
  'group/editor',
  'relative w-full whitespace-pre-wrap break-words',
  'rounded-md ring-offset-background placeholder:text-muted-foreground/80 focus-visible:outline-none',
  '[&_[data-slate-placeholder]]:text-muted-foreground/80 [&_[data-slate-placeholder]]:!opacity-100',
  '[&_[data-slate-placeholder]]:top-[auto_!important]',
  '[&_strong]:font-bold'
), {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    disabled: {
      true: 'cursor-not-allowed opacity-50',
    },
    focused: {
      true: 'ring-2 ring-ring ring-offset-2',
    },
    variant: {
      ai: 'w-full px-0 text-sm',
      aiChat:
        'max-h-[min(70vh,320px)] w-full max-w-[700px] overflow-y-auto px-3 py-2 text-sm',
      default:
        'min-h-full w-full grow px-6 sm:px-16 pb-24 pt-4 text-base',
      demo: 'min-h-full w-full px-16 pb-24 pt-4 text-base',
      fullWidth: 'min-h-full grow w-full px-6 sm:px-16 pb-24 pt-4 text-base',
    },
  },
});

export const Editor = React.forwardRef(({ className, disabled, focused, variant, ...props }, ref) => {
  return (
    (<PlateContent
      ref={ref}
      className={cn(editorVariants({
        disabled,
        focused,
        variant,
      }), className)}
      disabled={disabled}
      disableDefaultStyles
      {...props} />)
  );
});

Editor.displayName = 'Editor';
