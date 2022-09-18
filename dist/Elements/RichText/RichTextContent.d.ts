import { RichText } from "./RichText";
declare class RichTextContent extends HTMLElement {
    shadowRoot: ShadowRoot;
    get richText(): RichText;
    constructor();
}
export { RichTextContent };
