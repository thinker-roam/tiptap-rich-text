import Code from "@tiptap/extension-code";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class CodePlugin extends PluginHandlerButton {
  public plugin = Code;

  handle() {
    this.richText.editor.chain().focus().toggleCode().run();
  }
}

registerPluginHandlerButton("rich-text-plugin-handler-code", CodePlugin);

export { CodePlugin };
