import { createSuggestionPluginDialog } from "../../../Core/createSuggestionPluginDialog";
import { registerPluginDialog } from "../../../Core/PluginDialog";
import { CustomMention } from "../../../Customs/CustomMention";

class HashtagPluginDialog extends createSuggestionPluginDialog() {
  public mode = "inline" as "inline";
  public plugin: typeof CustomMention;
}

registerPluginDialog("rich-text-plugin-dialog-hashtag", HashtagPluginDialog);

export { HashtagPluginDialog };
