import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class SuperscriptPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Mark<import("@tiptap/extension-superscript").SuperscriptExtensionOptions, any>;
    handle(): void;
}
export { SuperscriptPlugin };
