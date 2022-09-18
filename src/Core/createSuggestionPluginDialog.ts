import { CustomMention } from "../Customs/CustomMention";
import { PluginDialog } from "./PluginDialog";

export interface SuggestionPluginDialogType extends PluginDialog {
  listContainer: HTMLUListElement;
  renderSelectMenuOptions: (options: any[]) => void;
  getSelectedItemIndex: () => number;
  getSelectedItem: () => HTMLLIElement;
  setSelectedItem: (item: HTMLLIElement | number) => void;
}

export function createSuggestionPluginDialog() {
  return class SuggestionPluginDialog extends PluginDialog {
    public mode = "inline" as "inline";
    public plugin: typeof CustomMention;

    get listContainer(): HTMLUListElement {
      return this.namedFields.options as HTMLUListElement;
    }

    public renderSelectMenuOptions(options: any[]) {
      this.listContainer.innerHTML = "";
      options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option.label;
        button.tabIndex = -1;
        button.addEventListener("click", () => {
          this.richText.editor.commands.enter();
        });

        const li = document.createElement("li");
        li.dataset.url = option.url;
        li.dataset.label = option.label;
        li.appendChild(button);

        if (index === 0) {
          this.setSelectedItem(li);
        }
        this.listContainer.appendChild(li);
      });
    }

    getSelectedItem() {
      const liList: HTMLLIElement[] = Array.from(
        this.listContainer.children
      ) as HTMLLIElement[];
      return liList.find((li: HTMLLIElement) =>
        li.hasAttribute("data-selected")
      );
    }

    getSelectedItemIndex() {
      const liList: HTMLLIElement[] = Array.from(
        this.listContainer.children
      ) as HTMLLIElement[];
      return liList.findIndex((li: HTMLLIElement) =>
        li.hasAttribute("data-selected")
      );
    }

    setSelectedItem(item: HTMLLIElement | number) {
      let option: HTMLLIElement;

      if (typeof item === "number") {
        option = this.namedFields.options.children.item(item) as HTMLLIElement;
      } else {
        option = item;
      }

      this.listContainer.querySelectorAll("li").forEach((li) => {
        if (li !== item) {
          li.removeAttribute("data-selected");
        }
      });
      option.setAttribute("data-selected", "");
    }
  };
}
