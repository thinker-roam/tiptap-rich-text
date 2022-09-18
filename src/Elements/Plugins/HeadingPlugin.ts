import Heading, { Level } from "@tiptap/extension-heading";
import {
  registerPluginHandlerSelect,
  PluginHandlerSelect,
} from "../../Core/PluginHandlerSelect";

Heading.config.addInputRules = () => [];

class HeadingPlugin extends PluginHandlerSelect {
  public plugin = Heading;

  handle(value: string) {
    this.richText.editor
      .chain()
      .focus()
      .toggleHeading({ level: parseInt(value) as Level })
      .run();
  }
}

registerPluginHandlerSelect("rich-text-plugin-handler-heading", HeadingPlugin);

export { HeadingPlugin };
