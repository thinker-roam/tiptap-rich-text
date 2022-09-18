import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class OrderedListPlugin extends PluginHandlerButton {
  public plugin = OrderedList;

  connectedCallback() {
    super.connectedCallback();
    this.richText.registerPlugin(ListItem);
  }

  handle() {
    this.richText.editor.chain().focus().toggleOrderedList().run();
  }
}

registerPluginHandlerButton(
  "rich-text-plugin-handler-ordered-list",
  OrderedListPlugin
);

export { OrderedListPlugin };
