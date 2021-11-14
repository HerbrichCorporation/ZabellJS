import {customComponents} from "../library/simplicity/simplicity.js";
import {loader} from "../library/simplicity/processors/loader-processor.js";
import DomRouter from "../library/simplicity/directives/dom-router.js"
import MatToolbar from "../library/simplicity/components/navigation/mat-toolbar.js";

export default class DocumentationApp extends HTMLElement {

    active(value) {
        return window.location.hash.startsWith(`#/documentation/${value}/index`)
    }

    static get components() {
        return [DomRouter, MatToolbar];
    }

    static get template() {
        return loader("documentation/app.html");
    }
}

customComponents.define("app-documentation", DocumentationApp);
