import { RichText } from "./RichText";

class RichTextContent extends HTMLElement {
  public shadowRoot: ShadowRoot;

  public get richText(): RichText {
    return this.closest("rich-text");
  }

  constructor() {
    super();
    this.addEventListener("click", (e) => {
      if ((e.currentTarget as HTMLElement).localName === "a") {
        e.preventDefault();
      }
    });
  }
}

window.customElements.define("rich-text-content", RichTextContent);

export { RichTextContent };
