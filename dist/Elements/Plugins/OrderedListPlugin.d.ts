import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class OrderedListPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Node<import("@tiptap/extension-ordered-list").OrderedListOptions, any>;
    connectedCallback(): void;
    handle(): void;
}
export { OrderedListPlugin };
