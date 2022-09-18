import { PluginHandlerSelect } from "../../Core/PluginHandlerSelect";
declare class HeadingPlugin extends PluginHandlerSelect {
    plugin: import("@tiptap/core").Node<import("@tiptap/extension-heading").HeadingOptions, any>;
    handle(value: string): void;
}
export { HeadingPlugin };
