import CodeBlock from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class CodeBlockPlugin extends PluginHandlerButton {
  public plugin = CodeBlock.configure({ lowlight });

  handle() {
    this.richText.editor.chain().focus().toggleCodeBlock().run();
  }
}

registerPluginHandlerButton(
  "rich-text-plugin-handler-codeblock",
  CodeBlockPlugin
);

export { CodeBlockPlugin };
