import YouTube from "@tiptap/extension-youtube";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../../Core/PluginHandlerButton";

class YouTubePlugin extends PluginHandlerButton {
  public plugin = YouTube;
  public onHandle = "open" as "open";
  public dialogTemplateId = "rich-text-plugin-dialog-youtube";

  handle() {
    this.open();
  }
}

registerPluginHandlerButton("rich-text-plugin-handler-youtube", YouTubePlugin);

export { YouTubePlugin };
