import { PluginDialog } from "../../../Core/PluginDialog";
import { registerPluginDialog } from "../../../Core/PluginDialog";

class LinkPluginDialog extends PluginDialog {
  public mode = "editor" as "editor";
  public href: string;

  setValues() {
    this.href = this.namedFields.href.value;
  }

  handle() {
    this.richText.editor
      .chain()
      .focus()
      .setLink({ href: this.href, target: "_blank" })
      .run();

    this.richText.editor.chain().selectParentNode().insertContent(" ");
  }
}

registerPluginDialog("rich-text-plugin-dialog-link", LinkPluginDialog);

export { LinkPluginDialog };
