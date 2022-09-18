import Paragraph from "@tiptap/extension-paragraph";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class ParagraphPlugin extends PluginHandlerButton {
  public plugin = Paragraph;

  handle() {
    this.richText.editor.chain().focus().setParagraph().run();
  }
}

registerPluginHandlerButton(
  "rich-text-plugin-handler-paragraph",
  ParagraphPlugin
);

export { ParagraphPlugin };
