import { RichText } from "..";
import { registerPluginHandlerButton } from "./PluginHandlerButton";

class PluginDialog extends HTMLDialogElement {
  public static observedAttributes: string[] = ["mode"];
  public shadowRoot: ShadowRoot;
  public defaultMode = "editor";
  public mode: "fullscreen" | "editor" | "inline";
  public namedFields: Record<string, HTMLElement> = {};

  public get richText(): RichText {
    return this.closest<RichText>("rich-text");
  }

  onclose: (this: GlobalEventHandlers, ev: Event) => any = () => {
    this.richText.content
      .querySelectorAll<HTMLElement>("[data-dialog-anchor]")
      .forEach((element) => {
        element.removeAttribute("data-dialog-anchor");
      });
    this.remove();
  };

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
        this.style.position = "fixed";
        break;
      }
      case "inline": {
        const currentSelection = document.getSelection();
        const anchorNode = currentSelection.anchorNode
          .parentElement as HTMLElement;
        const currentRect = anchorNode.getBoundingClientRect();

        if (currentRect) {
          anchorNode.setAttribute("data-dialog-anchor", "");
          this.style.position = "absolute";
          this.style.right = "unset";
          this.style.bottom = "unset";
          this.style.left = `${currentRect.x + window.scrollX}px`;
          this.style.top = `${
            currentRect.y + currentRect.height + window.scrollY
          }px`;
        } else {
          this.close();
          this.remove();
          anchorNode.removeAttribute("data-dialog-anchor");
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
