import {customViews} from "../../../library/simplicity/simplicity.js";
import {loader} from "../../../library/simplicity/processors/loader-processor.js";
import DomCode from "../../../library/simplicity/directives/dom-code.js";

class Switch extends HTMLElement {

    value = "test1"

    static get components() {
        return [DomCode]
    }

    static get template() {
        return loader("documentation/basic/control-structure/switch.html")
    }

}

export default customViews.define({
    name: "control-structures-switch",
    class: Switch
})