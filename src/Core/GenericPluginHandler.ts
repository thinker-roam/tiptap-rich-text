import { MixinConstructor } from "ts-mixin-extended";
import { Mark, Node } from "@tiptap/core";
import { RichText } from "../Elements/RichText/RichText";
import { PluginDialog } from "./PluginDialog";

export function GenericPluginHandler<
  TBase extends MixinConstructor<HTMLElement>
>(Base: TBase) {
  return class GenericPluginHandler extends Base {
    public shadowRoot: ShadowRoot;
    public plugin: Node | Mark;
    public dialog: PluginDialog;
    public dialogTemplateId: string;

    public get richText(): RichText {
      return this.closest("rich-text");
    }

    connectedCallback() {
      if (this.plugin) {
        this.richText.registerPlugin(this.plugin);
      }
    }

    // @ts-ignore
    public open(...args: any) {
      const template: HTMLTemplateElement =
        this.richText.querySelector<HTMLTemplateElement>(
          `#${this.dialogTemplateId}`
        );

      this.dialog = document.createElement("dialog", {
        is: this.dialogTemplateId,
      }) as PluginDialog;
      this.dialog.open = true;
      this.dialog.setAttribute("is", this.dialogTemplateId);
      this.dialog.appendChild(template.content.cloneNode(true));

      this.richText.appendChild(this.dialog);
      this.dialog.setDialogStyles();
    }

    // @ts-ignore
    public handle(...args: any) {}
  };
}
