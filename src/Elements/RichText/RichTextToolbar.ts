class RichTextToolbar extends HTMLElement {
  public shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(document.createElement("slot"));
  }
}

window.customElements.define("rich-text-toolbar", RichTextToolbar);

export { RichTextToolbar };
