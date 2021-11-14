import {customComponents, customViews} from "../../simplicity.js";
import {loader} from "../../processors/loader-processor.js";
import DomRepeat from "../../directives/dom-repeat.js";
import DomSlot from "../../directives/dom-slot.js";
import MatTabs from "../navigation/mat-tabs.js";
import MatTab from "../navigation/mat-tab.js";
import MatPages from "../navigation/mat-pages.js";
import MatPage from "../navigation/mat-page.js";
import DomInput from "../../directives/dom-input.js";
import MatCheckboxContainer from "../form/container/mat-checkbox-container.js";
import MatInputContainer from "../form/container/mat-input-container.js";

class MatTableConfiguration extends HTMLElement {

    table;
    page = 0;

    left(index) {
        this.page--
        this.table.left(index)
    }

    right(index) {
        this.page++;
        this.table.right(index);
    }

    static get components() {
        return [DomRepeat, DomSlot, DomInput, MatTabs, MatTab, MatPages, MatPage, MatCheckboxContainer]
    }

    static get template() {
        return loader("library/simplicity/components/table/mat-table-configuration.html")
    }
}

export default customViews.define({
    name : "table-mat-table-configuration",
    class : MatTableConfiguration,
    header : "Table Configuration"
})