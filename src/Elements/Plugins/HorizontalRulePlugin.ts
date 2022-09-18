import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class HorizontalRulePlugin extends PluginHandlerButton {
  public plugin = HorizontalRule;

  handle() {
    this.richText.editor.chain().focus().setHorizontalRule().run();
  }
}

registerPluginHandlerButton(
  "rich-text-plugin-handler-horizontal-rule",
  HorizontalRulePlugin
);

export { HorizontalRulePlugin };
