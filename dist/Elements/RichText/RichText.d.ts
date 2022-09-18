import { Editor, JSONContent, Mark, Node } from "@tiptap/core";
import { RichTextContent } from "./RichTextContent";
declare class RichText extends HTMLElement {
    static observedAttributes: string[];
    shadowRoot: ShadowRoot;
    extensions: Array<Node | Mark>;
    editor: Editor;
    get content(): RichTextContent;
    get html(): string;
    get text(): string;
    get json(): JSONContent;
    get value(): string;
    constructor();
    connectedCallback(): void;
    registerPlugin(plugin: Node | Mark): void;
    private initEditor;
}
export { RichText };
