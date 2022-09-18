import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class UnderlinePlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Mark<import("@tiptap/extension-underline").UnderlineOptions, any>;
    handle(): void;
}
export { UnderlinePlugin };
