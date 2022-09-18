import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class HighlightPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Mark<import("@tiptap/extension-highlight").HighlightOptions, any>;
    handle(): void;
}
export { HighlightPlugin };
