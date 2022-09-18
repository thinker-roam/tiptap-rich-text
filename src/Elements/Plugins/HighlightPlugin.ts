import Highlight from "@tiptap/extension-highlight";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class HighlightPlugin extends PluginHandlerButton {
  public plugin = Highlight;

  handle() {
    this.richText.editor.chain().focus().toggleHighlight().run();
  }
}

registerPluginHandlerButton(
  "rich-text-plugin-handler-highlight",
  HighlightPlugin
);

export { HighlightPlugin };
