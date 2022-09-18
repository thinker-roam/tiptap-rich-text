import Italic from "@tiptap/extension-italic";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class ItalicPlugin extends PluginHandlerButton {
  public plugin = Italic;

  handle() {
    this.richText.editor.chain().focus().toggleItalic().run();
  }
}

registerPluginHandlerButton("rich-text-plugin-handler-italic", ItalicPlugin);

export { ItalicPlugin };
