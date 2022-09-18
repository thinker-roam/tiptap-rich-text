import History from "@tiptap/extension-history";
import {
  registerPluginHandlerBackground,
  PluginInitiator,
} from "../../Core/PluginInitiator";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class HistoryPlugin extends PluginInitiator {
  public plugin = History;
}
registerPluginHandlerBackground("rich-text-plugin-history", HistoryPlugin);

class HistoryPluginUndo extends PluginHandlerButton {
  handle() {
    this.richText.editor.chain().focus().undo().run();
  }
}
registerPluginHandlerButton(
  "rich-text-plugin-handler-history-undo",
  HistoryPluginUndo
);

class HistoryPluginRedo extends PluginHandlerButton {
  handle() {
    this.richText.editor.chain().focus().redo().run();
  }
}
registerPluginHandlerButton(
  "rich-text-plugin-handler-history-redo",
  HistoryPluginRedo
);

export { HistoryPlugin, HistoryPluginUndo, HistoryPluginRedo };
