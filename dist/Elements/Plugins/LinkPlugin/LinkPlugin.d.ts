import { PluginHandlerButton } from "../../../Core/PluginHandlerButton";
declare class LinkPlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Mark<import("@tiptap/extension-link").LinkOptions, any>;
    onHandle: "open";
    dialogTemplateId: string;
    handle(): void;
}
export { LinkPlugin };
