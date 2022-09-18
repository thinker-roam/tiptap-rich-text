import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class UnorderedListPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Node<import("@tiptap/extension-bullet-list").BulletListOptions, any>;
    connectedCallback(): void;
    handle(): void;
}
export { UnorderedListPlugin };
