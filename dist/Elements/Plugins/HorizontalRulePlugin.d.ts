import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class HorizontalRulePlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Node<import("@tiptap/extension-horizontal-rule").HorizontalRuleOptions, any>;
    handle(): void;
}
export { HorizontalRulePlugin };
