import { RichText } from "./RichText";

class RichTextContent extends HTMLElement {
  public shadowRoot: ShadowRoot;

  public get richText(): RichText {
    return this.closest("rich-text");
  }

  constructor() {
    super();
  }
}

window.customElements.define("rich-text-content", RichTextContent);

export { RichTextContent };
