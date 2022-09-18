import { RichText } from "..";
declare class PluginDialog extends HTMLDialogElement {
    static observedAttributes: string[];
    shadowRoot: ShadowRoot;
    private defaultMode;
    mode: "fullscreen" | "editor" | "inline";
    namedFields: Record<string, HTMLElement>;
    get richText(): RichText;
    connectedCallback(): void;
    attributeChangedCallback(attr: string): void;
    setDialogStyles(): void;
    setValues(): void;
    handle(...args: any): void;
}
declare function registerPluginDialog(name: string, constructor: CustomElementConstructor): void;
export { PluginDialog, registerPluginDialog };
