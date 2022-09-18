import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class ItalicPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Mark<import("@tiptap/extension-italic").ItalicOptions, any>;
    handle(): void;
}
export { ItalicPlugin };
