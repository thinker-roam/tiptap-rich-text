import DropCursor from "@tiptap/extension-dropcursor";
import {
  registerPluginHandlerBackground,
  PluginInitiator,
} from "../../Core/PluginInitiator";

class DropCursorPlugin extends PluginInitiator {
  public plugin = DropCursor;
}
registerPluginHandlerBackground(
  "rich-text-plugin-dropcursor",
  DropCursorPlugin
);

export { DropCursorPlugin };
