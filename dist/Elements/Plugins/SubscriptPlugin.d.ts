import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class SubscriptPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Mark<import("@tiptap/extension-subscript").SubscriptExtensionOptions, any>;
    handle(): void;
}
export { SubscriptPlugin };
