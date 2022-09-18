import Underline from "@tiptap/extension-underline";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class UnderlinePlugin extends PluginHandlerButton {
  public plugin = Underline;

  handle() {
    this.richText.editor.chain().focus().toggleUnderline().run();
  }
}

registerPluginHandlerButton(
  "rich-text-plugin-handler-underline",
  UnderlinePlugin
);

export { UnderlinePlugin };
