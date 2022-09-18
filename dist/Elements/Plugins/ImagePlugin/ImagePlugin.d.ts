import { PluginHandlerButton } from "../../../Core/PluginHandlerButton";
declare class ImagePlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Node<import("@tiptap/extension-image").ImageOptions, any>;
    onHandle: "open";
    dialogTemplateId: string;
    handle(): void;
}
export { ImagePlugin };
