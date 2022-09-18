import { PluginHandlerButton } from "../../../Core/PluginHandlerButton";
declare class YouTubePlugin extends PluginHandlerButton {
    plugin: import("@tiptap/core").Node<import("@tiptap/extension-youtube").YoutubeOptions, any>;
    onHandle: "open";
    dialogTemplateId: string;
    handle(): void;
}
export { YouTubePlugin };
