import Link from "@tiptap/extension-link";
import {
  registerPluginHandlerButton,
  PluginHandlerButton,
} from "../../Core/PluginHandlerButton";

class LinkPlugin extends PluginHandlerButton {
  public plugin = Link.configure({
    openOnClick: false,
  });

  handle() {
    const selectedContent = this.richText.editor.view.nodeDOM(
      this.richText.editor.view.state.selection.head
    )?.textContent;

    if (selectedContent) {
      const linkHref = selectedContent.startsWith("http://")
        ? selectedContent
        : `http://${selectedContent}`;

      this.richText.editor
        .chain()
        .focus()
        .toggleLink({ href: linkHref, target: "_blank" })
        .run();
    }
  }
}

registerPluginHandlerButton("rich-text-plugin-handler-link", LinkPlugin);

export { LinkPlugin };
