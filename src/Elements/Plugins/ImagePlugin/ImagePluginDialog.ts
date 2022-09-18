import { PluginDialog } from "../../../Core/PluginDialog";
import { registerPluginDialog } from "../../../Core/PluginDialog";

class ImagePluginDialog extends PluginDialog {
  public mode = "editor" as "editor";
  public src: string;
  public alt: string;
  private previewUrl: string;

  setValues() {
    this.src = this.namedFields.src.value;
    this.alt = this.namedFields.alt.value;
  }

  upload() {
    const file = (this.namedFields.src as HTMLInputElement).files[0];
    this.previewUrl = window.URL.createObjectURL(file);
  }

  handle() {
    this.upload();
    this.richText.editor
      .chain()
      .focus()
      .setImage({ src: this.previewUrl, alt: this.alt })
      .run();
  }
}

registerPluginDialog("rich-text-plugin-dialog-image", ImagePluginDialog);

export { ImagePluginDialog };
