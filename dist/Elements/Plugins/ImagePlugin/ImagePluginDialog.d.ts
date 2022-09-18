import { PluginDialog } from "../../../Core/PluginDialog";
declare class ImagePluginDialog extends PluginDialog {
    mode: "editor";
    src: string;
    alt: string;
    private previewUrl;
    setValues(): void;
    upload(): void;
    handle(): void;
}
export { ImagePluginDialog };
