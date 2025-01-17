import {customViews} from "../../../simplicity.js";
import {loader} from "../../../processors/loader-processor.js";
import {windowManager} from "../../../manager/window-manager.js";
import DomIf from "../../../directives/dom-if.js";

class ContextMenu extends HTMLElement {

    isCollapsed = true;
    path;

    preInitialize() {
        let selection = window.getSelection();
        this.isCollapsed = selection.isCollapsed;
    }

    cut() {
        document.execCommand("cut")
    }

    copy() {
        document.execCommand("copy")
    }

    paste() {
        document.execCommand("paste")
    }

    findElement(callback) {
        for (const pathElement of this.path) {
            if (callback(pathElement)) {
                return pathElement;
            }
        }
        return null;
    }

    get isExtensionContext() {
        return this.path.length > 0
    }

    get isFlexBoxContext() {
        return this.findElement((element) => {
            return element.className === "flex"
        })
    }

    addFlexColumn() {
        let flexBoxElement = this.findElement((element) => element.className === "flex");
        flexBoxElement.appendChild(document.createElement("div"))
    }

    removeFlexColumn() {
        let flexBoxElement = this.findElement((element) => element.className === "flex");
        flexBoxElement.lastElementChild.remove();
    }

    get isTableContext() {
        return this.findElement((element) => {
            return element.localName === "table";
        });
    }

    addTableRow() {
        let tableElement = this.findElement((element) => element.localName === "table");
        let tbodyElement = tableElement.querySelector("tbody");
        let tableRowElement = tbodyElement.querySelector("tr");
        let tableColElement = tableRowElement.querySelectorAll("td");

        let tr = document.createElement("tr");
        for (let i = 0; i < tableColElement.length; i++) {
            let td = document.createElement("td");
            tr.appendChild(td);
        }

        tbodyElement.appendChild(tr);
    }

    addTableColumns() {
        let tableElement = this.findElement((element) => element.localName === "table");
        let tbodyElement = tableElement.querySelector("tbody");
        let tableRowElements = tbodyElement.querySelectorAll("tr");

        for (const tableRowElement of tableRowElements) {
            tableRowElement.appendChild(document.createElement("td"))
        }
    }

    removeTableRow() {
        let tableElement = this.findElement((element) => element.localName === "table");
        let tbodyElement = tableElement.querySelector("tbody");
        tbodyElement.lastElementChild.remove();
    }

    removeTableColumns() {
        let tableElement = this.findElement((element) => element.localName === "table");
        let tbodyElement = tableElement.querySelector("tbody");
        let trElements = tbodyElement.querySelectorAll("tr");
        for (const trElement of trElements) {
            trElement.lastElementChild.remove();
        }
    }

    extension() {
        windowManager.openWindow("/library/simplicity/components/form/mat-editor/dialog/extended-dialog", {
            data: {
                path: this.path
            }
        })
    }

    static get components() {
        return [DomIf]
    }

    static get template() {
        return loader("library/simplicity/components/form/mat-editor/context-menu.html")
    }

}

export default customViews.define({
    name: "context-menu",
    class: ContextMenu
})