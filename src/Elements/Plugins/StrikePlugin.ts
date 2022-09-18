import Strike from "@tiptap/extension-strike";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class StrikePlugin extends PluginHandlerButton {
  public plugin = Strike;

  handle() {
    this.richText.editor.chain().focus().toggleStrike().run();
  }
}

registerPluginHandlerButton("rich-text-plugin-handler-strike", StrikePlugin);

export { StrikePlugin };
