import HardBreak from "@tiptap/extension-hard-break";
import {
  registerPluginHandlerBackground,
  PluginInitiator,
} from "../../Core/PluginInitiator";

class HardBreakPlugin extends PluginInitiator {
  public plugin = HardBreak;
}
registerPluginHandlerBackground("rich-text-plugin-hard-break", HardBreakPlugin);

export { HardBreakPlugin };
