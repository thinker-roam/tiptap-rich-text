import { Node } from "@tiptap/core";
import { SuggestionOptions } from "@tiptap/suggestion";
import { Node as ProseMirrorNode } from "prosemirror-model";
export declare type CustomOptions = {
    HTMLAttributes: Record<string, any>;
    renderLabel: (props: {
        options: CustomOptions;
        node: ProseMirrorNode;
    }) => string;
    suggestion: Omit<SuggestionOptions, "editor">;
};
export declare const CustomMention: (name: string) => Node<CustomOptions, any>;
