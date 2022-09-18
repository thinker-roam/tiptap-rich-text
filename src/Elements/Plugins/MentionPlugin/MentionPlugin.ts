import { registerPluginHandlerBackground } from "../../../Core/PluginInitiator";
import { MentionPluginDialog } from "./MentionPluginDialog";
import { createSuggestionPlugin } from "../../../Core/createSuggestionPlugin";

class MentionPlugin extends createSuggestionPlugin({
  key: "mention",
  name: "mention",
  char: "@",
  class: "mention",
}) {
  public dialogTemplateId = "rich-text-plugin-dialog-mention";
  public dialog: MentionPluginDialog;

  static async getItems(query: string) {
    return [{}];
  }

  async getItems(query: string) {
    return MentionPlugin.getItems(query);
  }
}

registerPluginHandlerBackground("rich-text-plugin-mention", MentionPlugin);

export { MentionPlugin };
