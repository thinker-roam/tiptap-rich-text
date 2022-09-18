export { RichText } from "./Elements/RichText/RichText";
export { RichTextToolbar } from "./Elements/RichText/RichTextToolbar";
export { RichTextContent } from "./Elements/RichText/RichTextContent";

export {
  HistoryPlugin,
  HistoryPluginUndo,
  HistoryPluginRedo,
} from "./Elements/Plugins/HistoryPlugin";

export { HeadingPlugin } from "./Elements/Plugins/HeadingPlugin";
export { ParagraphPlugin } from "./Elements/Plugins/ParagraphPlugin";
export { BoldPlugin } from "./Elements/Plugins/BoldPlugin";
export { ItalicPlugin } from "./Elements/Plugins/ItalicPlugin";
export { UnderlinePlugin } from "./Elements/Plugins/UnderlinePlugin";
export { StrikePlugin } from "./Elements/Plugins/StrikePlugin";
export { CodePlugin } from "./Elements/Plugins/CodePlugin";
export { SuperscriptPlugin } from "./Elements/Plugins/SuperscriptPlugin";
export { SubscriptPlugin } from "./Elements/Plugins/SubscriptPlugin";
export { HighlightPlugin } from "./Elements/Plugins/HighlightPlugin";
export { UnorderedListPlugin } from "./Elements/Plugins/UnorderedListPlugin";
export { OrderedListPlugin } from "./Elements/Plugins/OrderedListPlugin";
export { CodeBlockPlugin } from "./Elements/Plugins/CodeBlockPlugin";
export { HorizontalRulePlugin } from "./Elements/Plugins/HorizontalRulePlugin";

export { HardBreakPlugin } from "./Elements/Plugins/HardBreakPlugin";
export { DropCursorPlugin } from "./Elements/Plugins/DropCursorPlugin";

export { LinkPlugin } from "./Elements/Plugins/LinkPlugin/LinkPlugin";
export { LinkPluginDialog } from "./Elements/Plugins/LinkPlugin/LinkPluginDialog";

export { ImagePlugin } from "./Elements/Plugins/ImagePlugin/ImagePlugin";
export { ImagePluginDialog } from "./Elements/Plugins/ImagePlugin/ImagePluginDialog";
export { YouTubePlugin } from "./Elements/Plugins/YouTubePlugin/YouTubePlugin";
export { YouTubePluginDialog } from "./Elements/Plugins/YouTubePlugin/YouTubePluginDialog";

import { MentionPlugin } from "./Elements/Plugins/MentionPlugin/MentionPlugin";
export { MentionPlugin } from "./Elements/Plugins/MentionPlugin/MentionPlugin";
export { MentionPluginDialog } from "./Elements/Plugins/MentionPlugin/MentionPluginDialog";

import { HashtagPlugin } from "./Elements/Plugins/HashtagPlugin/HashtagPlugin";
export { HashtagPlugin } from "./Elements/Plugins/HashtagPlugin/HashtagPlugin";
export { HashtagPluginDialog } from "./Elements/Plugins/HashtagPlugin/HashtagPluginDialog";

MentionPlugin.getItems = async (query: string) => {
  const list = [
    {
      name: "johnDoe",
      label: "John Doe",
      url: "@johnDoe",
    },
    {
      name: "markwallace",
      label: "Mark Wallace",
      url: "@markwallace",
    },
    {
      name: "annapurna",
      label: "Anna Purna",
      url: "@annapurna",
    },
  ];

  return list.filter((option) => option.name.startsWith(query));
};

HashtagPlugin.getItems = async (query: string) => {
  const list = [
    {
      label: "johnDoe",
      url: "#johnDoe",
    },
    {
      label: "markwallace",
      url: "#markwallace",
    },
    {
      label: "annapurna",
      url: "#annapurna",
    },
  ];

  return list.filter((option) => option.label.startsWith(query));
};
