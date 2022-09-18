import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class BoldPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Mark<import("@tiptap/extension-bold").BoldOptions, any>;
    handle(): void;
}
export { BoldPlugin };
