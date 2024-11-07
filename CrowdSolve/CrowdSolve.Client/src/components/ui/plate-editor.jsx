'use client';

import React from 'react';
import { withProps } from '@udecode/cn';
import { createPlateEditor, Plate, ParagraphPlugin, PlateElement, PlateLeaf } from '@udecode/plate-common/react';
import { HeadingPlugin, TocPlugin } from '@udecode/plate-heading/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { ListPlugin, BulletedListPlugin, NumberedListPlugin, ListItemPlugin, TodoListPlugin } from '@udecode/plate-list/react';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { ColumnPlugin, ColumnItemPlugin } from '@udecode/plate-layout/react';
import { TablePlugin, TableRowPlugin, TableCellPlugin, TableCellHeaderPlugin } from '@udecode/plate-table/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { CaptionPlugin } from '@udecode/plate-caption/react';
import { BoldPlugin, ItalicPlugin, UnderlinePlugin, StrikethroughPlugin, CodePlugin, SubscriptPlugin, SuperscriptPlugin } from '@udecode/plate-basic-marks/react';
import { FontColorPlugin, FontBackgroundColorPlugin, FontSizePlugin } from '@udecode/plate-font/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { AlignPlugin } from '@udecode/plate-alignment/react';
import { IndentPlugin } from '@udecode/plate-indent/react';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { LineHeightPlugin } from '@udecode/plate-line-height/react';
import { AutoformatPlugin } from '@udecode/plate-autoformat/react';
import { BlockSelectionPlugin, BlockMenuPlugin } from '@udecode/plate-selection/react';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { ResetNodePlugin } from '@udecode/plate-reset-node/react';
import { DeletePlugin } from '@udecode/plate-select';
import { TabbablePlugin } from '@udecode/plate-tabbable/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { CommentsPlugin } from '@udecode/plate-comments/react';
import { DndPlugin } from '@udecode/plate-dnd';
import { SlashPlugin } from '@udecode/plate-slash-command/react';
import { DocxPlugin } from '@udecode/plate-docx';
import { CsvPlugin } from '@udecode/plate-csv';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BlockquoteElement } from '@/components/plate-ui/blockquote-element';
import { ExcalidrawElement } from '@/components/plate-ui/excalidraw-element';
import { HrElement } from '@/components/plate-ui/hr-element';
import { ImageElement } from '@/components/plate-ui/image-element';
import { LinkElement } from '@/components/plate-ui/link-element';
import { LinkFloatingToolbar } from '@/components/plate-ui/link-floating-toolbar';
import { ToggleElement } from '@/components/plate-ui/toggle-element';
import { ColumnGroupElement } from '@/components/plate-ui/column-group-element';
import { ColumnElement } from '@/components/plate-ui/column-element';
import { HeadingElement } from '@/components/plate-ui/heading-element';
import { ListElement } from '@/components/plate-ui/list-element';
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';
import { ParagraphElement } from '@/components/plate-ui/paragraph-element';
import { TableElement } from '@/components/plate-ui/table-element';
import { TableRowElement } from '@/components/plate-ui/table-row-element';
import { TableCellElement, TableCellHeaderElement } from '@/components/plate-ui/table-cell-element';
import { TodoListElement } from '@/components/plate-ui/todo-list-element';
import { DateElement } from '@/components/plate-ui/date-element';
import { CodeLeaf } from '@/components/plate-ui/code-leaf';
import { CommentLeaf } from '@/components/plate-ui/comment-leaf';
import { CommentsPopover } from '@/components/plate-ui/comments-popover';
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf';
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf';
import { Editor } from '@/components/plate-ui/editor';
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons';
import { withPlaceholders } from '@/components/plate-ui/placeholder';
import { withDraggables } from '@/components/plate-ui/with-draggables';

const createMyEditor = (initialValue = []) => createPlateEditor({
  plugins: [
    ParagraphPlugin,
    HeadingPlugin,
    BlockquotePlugin,
    HorizontalRulePlugin,
    LinkPlugin.configure({
      render: { afterEditable: () => <LinkFloatingToolbar /> },
    }),
    ListPlugin,
    ImagePlugin,
    ExcalidrawPlugin,
    TogglePlugin,
    ColumnPlugin,
    MediaEmbedPlugin,
    TablePlugin,
    TodoListPlugin,
    DatePlugin,
    TocPlugin,
    CaptionPlugin.configure({
      options: { plugins: [ImagePlugin, MediaEmbedPlugin] },
    }),
    BoldPlugin,
    ItalicPlugin,
    UnderlinePlugin,
    StrikethroughPlugin,
    CodePlugin,
    SubscriptPlugin,
    SuperscriptPlugin,
    FontColorPlugin,
    FontBackgroundColorPlugin,
    FontSizePlugin,
    HighlightPlugin,
    KbdPlugin,
    AlignPlugin.configure({
      inject: { targetPlugins: ['p', 'h1', 'h2', 'h3'] },
    }),
    IndentPlugin.configure({
      inject: { targetPlugins: ['p', 'h1', 'h2', 'h3'] },
    }),
    IndentListPlugin.configure({
      inject: { targetPlugins: ['p', 'h1', 'h2', 'h3'] },
    }),
    LineHeightPlugin.configure({
      inject: {
        nodeProps: {
          defaultNodeValue: 1.5,
          validNodeValues: [1, 1.2, 1.5, 2, 3],
        },
        targetPlugins: ['p', 'h1', 'h2', 'h3'],
      },
    }),
    AutoformatPlugin.configure({
      options: {
        enableUndoOnDelete: true,
        rules: [
          // Usage: https://platejs.org/docs/autoformat
        ],
      },
    }),
    BlockSelectionPlugin,
    EmojiPlugin,
    ExitBreakPlugin.configure({
      options: {
        rules: [
          {
            hotkey: 'mod+enter',
          },
          {
            before: true,
            hotkey: 'mod+shift+enter',
          },
          {
            hotkey: 'enter',
            level: 1,
            query: {
              allow: ['h1', 'h2', 'h3'],
              end: true,
              start: true,
            },
            relative: true,
          },
        ],
      },
    }),
    NodeIdPlugin,
    ResetNodePlugin.configure({
      options: {
        rules: [
          // Usage: https://platejs.org/docs/reset-node
        ],
      },
    }),
    DeletePlugin,
    SoftBreakPlugin.configure({
      options: {
        rules: [
          { hotkey: 'shift+enter' },
          {
            hotkey: 'enter',
            query: {
              allow: ['code_block', 'blockquote', 'td', 'th'],
            },
          },
        ],
      },
    }),
    TabbablePlugin,
    TrailingBlockPlugin.configure({
      options: { type: 'p' },
    }),
    CommentsPlugin,
    BlockMenuPlugin,
    DndPlugin.configure({
        options: { enableScroller: true },
    }),
    SlashPlugin,
    DocxPlugin,
    CsvPlugin,
    MarkdownPlugin,
  ],
  override: {
    components: withDraggables(withPlaceholders(({
      [BlockquotePlugin.key]: BlockquoteElement,
      [ExcalidrawPlugin.key]: ExcalidrawElement,
      [HorizontalRulePlugin.key]: HrElement,
      [ImagePlugin.key]: ImageElement,
      [LinkPlugin.key]: LinkElement,
      [TogglePlugin.key]: ToggleElement,
      [ColumnPlugin.key]: ColumnGroupElement,
      [ColumnItemPlugin.key]: ColumnElement,
      [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
      [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
      [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
      [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
      [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
      [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
      [BulletedListPlugin.key]: withProps(ListElement, { variant: 'ul' }),
      [NumberedListPlugin.key]: withProps(ListElement, { variant: 'ol' }),
      [ListItemPlugin.key]: withProps(PlateElement, { as: 'li' }),
      [MediaEmbedPlugin.key]: MediaEmbedElement,
      [ParagraphPlugin.key]: ParagraphElement,
      [TablePlugin.key]: TableElement,
      [TableRowPlugin.key]: TableRowElement,
      [TableCellPlugin.key]: TableCellElement,
      [TableCellHeaderPlugin.key]: TableCellHeaderElement,
      [TodoListPlugin.key]: TodoListElement,
      [DatePlugin.key]: DateElement,
      [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
      [CodePlugin.key]: CodeLeaf,
      [CommentsPlugin.key]: CommentLeaf,
      [HighlightPlugin.key]: HighlightLeaf,
      [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
      [KbdPlugin.key]: KbdLeaf,
      [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
      [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
      [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
      [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
    }))),
  },
  value: initialValue,
});

export function PlateEditor({ value, onChange, ...props }) {
  if (value === '') {
    value = [{ type: 'p', children: [{ text: '' }] }];
  }
  else if (value != null && typeof value === 'string') {
    console.log(value);
    value = JSON.parse(value);
  }

  const [editor] = React.useState(() => createMyEditor(value))

  React.useEffect(() => {
    if (value && !editor.length) {
      editor.value = value
    }
  }, [editor, value])

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onChange={onChange} {...props}>
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
        <Editor />
        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
        <CommentsPopover />
      </Plate>
    </DndProvider>
  );
}