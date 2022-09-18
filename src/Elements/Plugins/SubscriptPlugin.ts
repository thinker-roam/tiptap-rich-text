import Subscript from "@tiptap/extension-subscript";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class SubscriptPlugin extends PluginHandlerButton {
  public plugin = Subscript;

  handle() {
    this.richText.editor.chain().focus().toggleSubscript().run();
  }
}

registerPluginHandlerButton(
  "rich-text-plugin-handler-subscript",
  SubscriptPlugin
);

export { SubscriptPlugin };
