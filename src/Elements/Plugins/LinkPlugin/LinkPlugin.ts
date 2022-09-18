import Link from "@tiptap/extension-link";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../../Core/PluginHandlerButton";

class LinkPlugin extends PluginHandlerButton {
  public plugin = Link.configure({
    openOnClick: false,
  });
  public onHandle = "open" as "open";
  public dialogTemplateId = "rich-text-plugin-dialog-link";

  handle() {
    const selection = this.richText.editor.view.state.selection;
    if (selection.empty) {
      this.richText.editor.chain().focus().unsetLink();
    } else {
      this.open();
    }
  }
}

registerPluginHandlerButton("rich-text-plugin-handler-link", LinkPlugin);

export { LinkPlugin };
