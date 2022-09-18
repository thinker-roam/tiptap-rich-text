import { PluginDialog } from "../../../Core/PluginDialog";
import { registerPluginDialog } from "../../../Core/PluginDialog";

class YouTubePluginDialog extends PluginDialog {
  public mode = "editor" as "editor";
  public src: string;

  setValues() {
    // @ts-ignore
    this.src = this.namedFields.src.value;
  }

  handle() {
    this.richText.editor
      .chain()
      .focus()
      .setYoutubeVideo({ src: this.src })
      .run();
  }
}

registerPluginDialog("rich-text-plugin-dialog-youtube", YouTubePluginDialog);

export { YouTubePluginDialog };
