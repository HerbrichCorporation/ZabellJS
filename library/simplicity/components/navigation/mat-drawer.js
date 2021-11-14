import {customComponents} from "../../simplicity.js";
import {loader} from "../../processors/loader-processor.js";
import DomSlot from "../../directives/dom-slot.js";

class MatDrawer extends HTMLElement {

    open = false;

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "open" : {
                this.open = newValue;
            }
        }
    }

    static get observedAttributes() {
        return [
            {
                name: "open",
                type: "input"
            }
        ]
    }

    static get components() {
        return [DomSlot]
    }

    static get template() {
        return loader("library/simplicity/components/navigation/mat-drawer.html")
    }

}

export default customComponents.define("mat-drawer", MatDrawer)