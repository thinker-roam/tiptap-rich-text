import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class ParagraphPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Node<import("@tiptap/extension-paragraph").ParagraphOptions, any>;
    handle(): void;
}
export { ParagraphPlugin };
