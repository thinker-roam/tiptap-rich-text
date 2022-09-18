import { RichText } from "../main";
import { registerPluginHandlerButton } from "./PluginHandlerButton";

class PluginDialog extends HTMLDialogElement {
  public static observedAttributes: string[] = ["mode"];
  public shadowRoot: ShadowRoot;
  private defaultMode = "editor";
  public mode: "fullscreen" | "editor" | "inline";
  public namedFields: Record<string, HTMLElement> = {};

  public get richText(): RichText {
    return this.closest<RichText>("rich-text");
  }

  connectedCallback() {
    Array.from(this.querySelectorAll<HTMLElement>("[name]")).forEach(
      (field) => {
        this.namedFields[field.getAttribute("name")] = field;
      }
    );
    this.setDialogStyles();
  }

  // @ts-ignore
  attributeChangedCallback(attr: string) {
    if ((attr = "mode")) {
      this.setDialogStyles();
    }
  }

  public setDialogStyles() {
    const mode = this.mode || this.defaultMode;
    this.richText.editor.commands.focus();

    switch (mode) {
      case "fullscreen": {
        this.style.position = "fixed";
        break;
      }
      case "editor": {
        this.style.position = "absolute";
        break;
      }
      case "inline": {
        const currentSelection = document.getSelection();
        const anchorNode = currentSelection.anchorNode
          .parentElement as HTMLElement;
        const currentRect = anchorNode.getBoundingClientRect();

        if (currentRect) {
          this.style.position = "absolute";
          this.style.right = "unset";
          this.style.left = `${currentRect.x}px`;
          this.style.top = `${currentRect.y + currentRect.height}px`;
        } else {
          this.close();
        }
        break;
      }
    }
  }

  public setValues() {}

  // @ts-ignore
  public handle(...args: any) {}
}

class PluginDialogCancel extends HTMLButtonElement {
  public get dialog(): PluginDialog {
    return this.closest<PluginDialog>("dialog");
  }

  onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any = () => {
    this.dialog.close();
    this.dialog.remove();
  };
}
registerPluginHandlerButton(
  "rich-text-plugin-dialog-cancel",
  PluginDialogCancel
);

class PluginDialogSubmit extends HTMLButtonElement {
  public get dialog(): PluginDialog {
    return this.closest<PluginDialog>("dialog");
  }

  public get richText(): RichText {
    return this.closest<RichText>("rich-text");
  }

  onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any = () => {
    this.dialog.close();
    this.dialog.setValues();
    this.dialog.handle();
    this.richText.editor.commands.focus();
    this.dialog.remove();
  };
}
registerPluginHandlerButton(
  "rich-text-plugin-dialog-submit",
  PluginDialogSubmit
);

function registerPluginDialog(
  name: string,
  constructor: CustomElementConstructor
) {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, constructor, { extends: "dialog" });
  }
}

export { PluginDialog, registerPluginDialog };
