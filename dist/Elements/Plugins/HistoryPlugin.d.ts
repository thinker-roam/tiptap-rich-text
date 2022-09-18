import { PluginInitiator } from "../../Core/PluginInitiator";
import { PluginHandlerButton } from "../../Core/PluginHandlerButton";
declare class HistoryPlugin extends PluginInitiator {
    plugin: import("@tiptap/core").Extension<import("@tiptap/extension-history").HistoryOptions, any>;
}
declare class HistoryPluginUndo extends PluginHandlerButton {
    handle(): void;
}
declare class HistoryPluginRedo extends PluginHandlerButton {
    handle(): void;
}
export { HistoryPlugin, HistoryPluginUndo, HistoryPluginRedo };
