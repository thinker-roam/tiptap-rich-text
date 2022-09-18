import { registerPluginHandlerBackground } from "../../../Core/PluginInitiator";
import { HashtagPluginDialog } from "./HashtagPluginDialog";
import { createSuggestionPlugin } from "../../../Core/createSuggestionPlugin";

class HashtagPlugin extends createSuggestionPlugin({
  key: "hashtag",
  name: "hashtag",
  char: "#",
  class: "hashtag",
}) {
  public dialogTemplateId = "rich-text-plugin-dialog-hashtag";
  public dialog: HashtagPluginDialog;

  static async getItems(query: string) {
    return [{}];
  }

  async getItems(query: string) {
    return HashtagPlugin.getItems(query);
  }
}

registerPluginHandlerBackground("rich-text-plugin-hashtag", HashtagPlugin);

export { HashtagPlugin };
