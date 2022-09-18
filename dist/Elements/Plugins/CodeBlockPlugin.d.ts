import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class CodeBlockPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Node<import("@tiptap/extension-code-block-lowlight").CodeBlockLowlightOptions, any>;
    handle(): void;
}
export { CodeBlockPlugin };
