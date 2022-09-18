import mixin from "ts-mixin-extended";
import { GenericPluginHandler } from "./GenericPluginHandler";

class PluginHandlerButton extends mixin(
  HTMLButtonElement,
  GenericPluginHandler
) {
  onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any = () => {
    this.handle();
  };
}

function registerPluginHandlerButton(
  name: string,
  constructor: CustomElementConstructor
) {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, constructor, { extends: "button" });
  }
}

export { PluginHandlerButton, registerPluginHandlerButton };
