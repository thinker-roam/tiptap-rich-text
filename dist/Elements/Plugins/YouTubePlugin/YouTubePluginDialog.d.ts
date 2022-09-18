import { PluginDialog } from "../../../Core/PluginDialog";
declare class YouTubePluginDialog extends PluginDialog {
    mode: "editor";
    src: string;
    setValues(): void;
    handle(): void;
}
export { YouTubePluginDialog };
