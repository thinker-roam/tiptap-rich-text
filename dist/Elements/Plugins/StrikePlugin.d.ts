import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class StrikePlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Mark<import("@tiptap/extension-strike").StrikeOptions, any>;
    handle(): void;
}
export { StrikePlugin };
