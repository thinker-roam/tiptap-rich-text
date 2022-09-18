import { Mark, Node } from "@tiptap/core";
import { RichText } from "../Elements/RichText/RichText";
import { PluginDialog } from "./PluginDialog";
declare class PluginInitiator extends HTMLElement {
    shadowRoot: ShadowRoot;
    plugin: Node | Mark;
    dialog: PluginDialog;
    dialogTemplateId: string;
    get richText(): RichText;
    connectedCallback(): void;
    open(): void;
    close(): void;
}
declare function registerPluginHandlerBackground(name: string, constructor: CustomElementConstructor): void;
export { PluginInitiator, registerPluginHandlerBackground };
