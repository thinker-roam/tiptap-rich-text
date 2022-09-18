import { createSuggestionPluginDialog } from "../../../Core/createSuggestionPluginDialog";
import { registerPluginDialog } from "../../../Core/PluginDialog";
import { CustomMention } from "../../../Customs/CustomMention";

class MentionPluginDialog extends createSuggestionPluginDialog() {
  public mode = "inline" as "inline";
  public plugin: typeof CustomMention;
}

registerPluginDialog("rich-text-plugin-dialog-mention", MentionPluginDialog);

export { MentionPluginDialog };
