import Bold from "@tiptap/extension-bold";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class BoldPlugin extends PluginHandlerButton {
  public plugin = Bold;

  handle() {
    this.richText.editor.chain().focus().toggleBold().run();
  }
}

registerPluginHandlerButton("rich-text-plugin-handler-bold", BoldPlugin);

export { BoldPlugin };
