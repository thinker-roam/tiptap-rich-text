import mixin from "ts-mixin-extended";
import { GenericPluginHandler } from "./GenericPluginHandler";

class PluginHandlerSelect extends mixin(
  HTMLSelectElement,
  GenericPluginHandler
) {
  onchange: (this: GlobalEventHandlers, ev: Event) => any = (event) => {
    this.handle((event.target as HTMLSelectElement).value);
  };
}

function registerPluginHandlerSelect(
  name: string,
  constructor: CustomElementConstructor
) {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, constructor, { extends: "select" });
  }
}

export { PluginHandlerSelect, registerPluginHandlerSelect };
