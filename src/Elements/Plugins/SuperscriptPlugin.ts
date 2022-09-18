import Superscript from "@tiptap/extension-superscript";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class SuperscriptPlugin extends PluginHandlerButton {
  public plugin = Superscript;

  handle() {
    this.richText.editor.chain().focus().toggleSuperscript().run();
  }
}

registerPluginHandlerButton(
  "rich-text-plugin-handler-superscript",
  SuperscriptPlugin
);

export { SuperscriptPlugin };
