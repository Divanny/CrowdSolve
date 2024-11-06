'use client';;
import React from 'react';

import { cn } from '@udecode/cn';
import { PlateElement as PlateElementPrimitive } from '@udecode/plate-common/react';
import { useBlockSelectableStore } from '@udecode/plate-selection/react';

import { BlockSelection } from './block-selection';

export const PlateElement = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  const selectable = useBlockSelectableStore().get.selectable();

  return (
    (<PlateElementPrimitive ref={ref} className={cn('relative', className)} {...props}>
      {children}
      {selectable && <BlockSelection />}
    </PlateElementPrimitive>)
  );
});
