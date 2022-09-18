import { Mark, Node } from "@tiptap/core";
import { RichText } from "../Elements/RichText/RichText";
import { PluginDialog } from "./PluginDialog";

class PluginInitiator extends HTMLElement {
  public shadowRoot: ShadowRoot;
  public plugin: Node | Mark;
  public dialog: PluginDialog;
  public dialogTemplateId: string;

  public get richText(): RichText {
    return this.closest("rich-text");
  }

  connectedCallback() {
    this.richText.registerPlugin(this.plugin);
  }

  public open() {
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
  }

  public close() {
    this.dialog.close();
    this.dialog.remove();
  }
}

function registerPluginHandlerBackground(
  name: string,
  constructor: CustomElementConstructor
) {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, constructor);
  }
}

export { PluginInitiator, registerPluginHandlerBackground };
