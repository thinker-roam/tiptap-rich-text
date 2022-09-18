import UnorderedList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class UnorderedListPlugin extends PluginHandlerButton {
  public plugin = UnorderedList;

  connectedCallback() {
    super.connectedCallback();
    this.richText.registerPlugin(ListItem);
  }

  handle() {
    this.richText.editor.chain().focus().toggleBulletList().run();
  }
}

registerPluginHandlerButton(
  "rich-text-plugin-handler-unordered-list",
  UnorderedListPlugin
);

export { UnorderedListPlugin };
