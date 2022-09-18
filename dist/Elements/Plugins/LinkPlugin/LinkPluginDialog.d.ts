import { PluginDialog } from "../../../Core/PluginDialog";
declare class LinkPluginDialog extends PluginDialog {
    mode: "editor";
    href: string;
    setValues(): void;
    handle(): void;
}
export { LinkPluginDialog };
