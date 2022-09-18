import Image from "@tiptap/extension-image";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../../Core/PluginHandlerButton";

class ImagePlugin extends PluginHandlerButton {
  public plugin = Image;
  public onHandle = "open" as "open";
  public dialogTemplateId = "rich-text-plugin-dialog-image";

  handle() {
    this.open();
  }
}

registerPluginHandlerButton("rich-text-plugin-handler-image", ImagePlugin);

export { ImagePlugin };
