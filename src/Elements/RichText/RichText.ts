import { Editor, JSONContent, Mark, Node } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Gapcursor from "@tiptap/extension-gapcursor";
import { RichTextContent } from "./RichTextContent";

class RichText extends HTMLElement {
  static observedAttributes = ["value"];
  public shadowRoot: ShadowRoot;
  public extensions: Array<Node | Mark> = [Document, Text, Gapcursor];
  public editor: Editor;

  public get content(): RichTextContent {
    return this.querySelector("rich-text-content");
  }

  public get html(): string {
    return this.editor.getHTML();
  }

  public get text(): string {
    return this.editor.getText();
  }

  public get json(): JSONContent {
    return this.editor.getJSON();
  }

  public get value(): string {
    return JSON.stringify(this.json);
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.attachInternals();
    this.shadowRoot.appendChild(document.createElement("slot"));
  }

  connectedCallback() {
    window.setTimeout(() => {
      this.initEditor();
    }, 0);
  }

  registerPlugin(plugin: Node | Mark) {
    if (!this.extensions.includes(plugin)) {
      this.extensions.push(plugin);
    }
  }

  private initEditor() {
    const content =
      this.content.innerHTML.length > 1
        ? this.content.innerHTML
        : JSON.parse(this.getAttribute("value"));
    this.content.innerHTML = "";

    this.editor = new Editor({
      element: this.content,
      extensions: this.extensions,
      autofocus: true,
      content,
    });
    this.removeAttribute("value");
  }
}

window.customElements.define("rich-text", RichText);

export { RichText };
