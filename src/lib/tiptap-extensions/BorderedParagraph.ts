import { Node, mergeAttributes } from '@tiptap/core'

export interface BorderedParagraphOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    borderedParagraph: {
      /**
       * Toggle a bordered paragraph
       */
      toggleBorderedParagraph: () => ReturnType
    }
  }
}

export const BorderedParagraph = Node.create<BorderedParagraphOptions>({
  name: 'borderedParagraph',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  content: 'inline*',

  group: 'block',

  defining: true,

  parseHTML() {
    return [
      {
        tag: 'p[data-bordered="true"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'p',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-bordered': 'true',
      }),
      0,
    ]
  },

  addCommands() {
    return {
      toggleBorderedParagraph:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph')
        },
    }
  },
})

