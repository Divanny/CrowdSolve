'use client';;
import React from 'react';

import { cn, withRef } from '@udecode/cn';
import { useElement, withHOC } from '@udecode/plate-common/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import { useReadOnly } from 'slate-react';

import { PlateElement } from './plate-element';

export const ColumnElement = withHOC(ResizableProvider, withRef(({ children, className, ...props }, ref) => {
  const readOnly = useReadOnly();
  const { width } = useElement();

  return (
    (<PlateElement
      ref={ref}
      className={cn(className, !readOnly && 'rounded-lg border border-dashed p-1.5')}
      style={{ width }}
      {...props}>
      {children}
    </PlateElement>)
  );
}));
