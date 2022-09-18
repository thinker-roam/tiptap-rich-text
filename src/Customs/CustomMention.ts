import { mergeAttributes, Node } from "@tiptap/core";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import { Node as ProseMirrorNode } from "prosemirror-model";

export type CustomOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: {
    options: CustomOptions;
    node: ProseMirrorNode;
  }) => string;
  suggestion: Omit<SuggestionOptions, "editor">;
};

export const CustomMention = (name: string) =>
  Node.create<CustomOptions>({
    name,

    addOptions() {
      return {
        HTMLAttributes: {},
        renderLabel({ options, node }) {
          return `${options.suggestion.char}${
            node.attrs.label ?? node.attrs.id
          }`;
        },
        suggestion: {
          char: "@",
          command: ({ editor, range, props }) => {
            // increase range.to by one when the next node is of type "text"
            // and starts with a space character
            const nodeAfter = editor.view.state.selection.$to.nodeAfter;
            const overrideSpace = nodeAfter?.text?.startsWith(" ");

            if (overrideSpace) {
              range.to += 1;
            }

            editor
              .chain()
              .focus()
              .insertContentAt(range, [
                {
                  type: this.name,
                  attrs: props,
                },
                {
                  type: "text",
                  text: " ",
                },
              ])
              .run();

            window.getSelection()?.collapseToEnd();
          },
          allow: ({ state, range }) => {
            const $from = state.doc.resolve(range.from);
            const type = state.schema.nodes[this.name];
            const allow = !!$from.parent.type.contentMatch.matchType(type);

            return allow;
          },
        },
      };
    },

    group: "inline",

    inline: true,

    selectable: false,

    atom: true,

    addAttributes() {
      return {
        rel: {
          default: null,
          parseHTML: (element) => element.getAttribute("rel"),
          renderHTML: (attributes) => {
            if (!attributes.rel) {
              return {
                rel: "noopener noreferrer nofollow",
              };
            }
            return {
              rel: attributes.rel,
            };
          },
        },
        href: {
          default: null,
          parseHTML: (element) => element.getAttribute("href"),
          renderHTML: (attributes) => {
            if (!attributes.href) {
              return {};
            }

            return {
              href: attributes.href,
            };
          },
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: `a[data-type="${this.name}"]`,
        },
      ];
    },

    renderHTML({ node, HTMLAttributes }) {
      return [
        "a",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        this.options.renderLabel({
          options: this.options,
          node,
        }),
      ];
    },

    renderText({ node }) {
      return this.options.renderLabel({
        options: this.options,
        node,
      });
    },

    addKeyboardShortcuts() {
      return {
        Backspace: () =>
          this.editor.commands.command(({ tr, state }) => {
            let isCustom = false;
            const { selection } = state;
            const { empty, anchor } = selection;

            if (!empty) {
              return false;
            }

            // @ts-ignore
            state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
              if (node.type.name === this.name) {
                isCustom = true;
                tr.insertText(
                  this.options.suggestion.char || "",
                  pos,
                  pos + node.nodeSize
                );

                return false;
              }
            });

            return isCustom;
          }),
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });
