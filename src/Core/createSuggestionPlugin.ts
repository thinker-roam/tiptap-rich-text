import { Node, Range } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { CustomMention, CustomOptions } from "../Customs/CustomMention";
import { SuggestionProps } from "@tiptap/suggestion";
import { PluginInitiator } from "./PluginInitiator";
import type { SuggestionPluginDialogType } from "./createSuggestionPluginDialog";

type SuggestionPluginOptions = {
  key: string;
  name: string;
  char: string;
  class: string;
};

export function createSuggestionPlugin(options: SuggestionPluginOptions) {
  const customMention = CustomMention(options.name);
  return class SuggestionPlugin extends PluginInitiator {
    public dialogTemplateId: string;
    public dialog: SuggestionPluginDialogType;

    public plugin: Node<CustomOptions, any> = customMention.configure({
      HTMLAttributes: {
        class: options.class,
      },
      suggestion: {
        char: options.char,
        pluginKey: new PluginKey(options.key),
        items: async (props) => await this.getItems(props.query.toLowerCase()),
        render: () => ({
          onStart: (props) => {
            this.handle(props);
          },
          onExit: () => {
            this.dialog.close();
          },
          onUpdate: async (props) => {
            this.dialog.renderSelectMenuOptions(props.items);
          },
          onKeyDown: (props) => {
            const currentIndex = this.dialog.getSelectedItemIndex();
            const childCount = this.dialog.listContainer.childElementCount;

            switch (props.event.key) {
              case "ArrowDown": {
                props.event.preventDefault();
                if (currentIndex === childCount - 1) {
                  this.dialog.setSelectedItem(0);
                } else {
                  this.dialog.setSelectedItem(currentIndex + 1);
                }
                return true;
              }
              case "ArrowUp": {
                props.event.preventDefault();
                if (currentIndex === 0) {
                  this.dialog.setSelectedItem(childCount - 1);
                } else {
                  this.dialog.setSelectedItem(currentIndex - 1);
                }
                return true;
              }
              case "Enter": {
                const nodeAfter =
                  this.richText.editor.view.state.selection.$to.nodeAfter;
                const overrideSpace = nodeAfter?.text?.startsWith(" ");
                const { url, label } = this.dialog.getSelectedItem().dataset;
                const data = {
                  url,
                  label,
                };

                if (overrideSpace) {
                  props.range.to += 1;
                }
                this.insert(props.range, data);
                return true;
              }
              case "Escape": {
                this.close();
                return false;
              }
            }
            return false;
          },
        }),
      },
    });

    // @ts-ignore
    async getItems(query: string) {
      return [{}];
    }

    handle(props: SuggestionProps<any>) {
      this.open();
      this.dialog.renderSelectMenuOptions(props.items);
    }

    insert(range: Range, data: Record<string, string>) {
      const content = () => {
        return [
          {
            type: options.name,
            attrs: {
              href: data.url,
              label: data.label,
            },
          },
          {
            type: "text",
            text: " ",
          },
        ];
      };
      this.richText.editor
        .chain()
        .focus()
        .insertContentAt(range, content())
        .run();
      this.close();

      window.getSelection()?.collapseToEnd();
    }
  };
}
