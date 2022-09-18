import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class CodePlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Mark<import("@tiptap/extension-code").CodeOptions, any>;
    handle(): void;
}
export { CodePlugin };
