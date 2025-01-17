import {customComponents} from "../../../../simplicity.js";
import {loader} from "../../../../processors/loader-processor.js";
import {windowManager} from "../../../../manager/window-manager.js";

class ToolbarInserts extends HTMLElement {

    contents;

    link = {
        value: "",
        active: false,
        click(link) {
            let selection = document.getSelection();
            let rangeAt = selection.getRangeAt(0);

            let options = {
                header: "Link Dialog"
            };

            windowManager.openWindow("/library/simplicity/components/form/mat-editor/dialog/link-dialog", options).then((matWindow) => {
                matWindow.addEventListener("ok", (event) => {
                    let value = event.target.contents.value;
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(rangeAt);
                    document.execCommand("createLink", false, value);
                    matWindow.close();
                })
            });
        },
        handler(event) {

        }
    }
    unLink = {
        active: false,
        click(event) {
            document.execCommand("unlink")
        },
        handler(event) {

        }
    }
    insertDivFlex = {
        disabled: false,
        click(columns = 2) {
            let columnsHTML = ""
            for (let i = 0; i < columns; i++) {
                columnsHTML += "<div></div>"
            }

            let html = "<div class='flex' style='width: 100%'>" + columnsHTML + "</div>"

            document.execCommand("insertHTML", false, html)
        }
    }
    insertTable = {
        click(columns = 2, rows = 2) {
            let columnsHTML = "";
            for (let i = 0; i < columns; i++) {
                columnsHTML += "<td></td>"
            }

            let rowsHTML = "";
            for (let i = 0; i < rows; i++) {
                rowsHTML += "<tr>" + columnsHTML + "</tr>"
            }

            let table = "<table style='width: 100%'><tbody>" + rowsHTML + "</tbody></table>";

            document.execCommand("insertHTML", false, table)
        }
    }
    image = {
        active: false,
        click(event) {
            let selection = document.getSelection();
            let rangeAt = selection.getRangeAt(0);

            let options = {
                width: "640px",
                height: "480px",
                header: "Image Upload"
            };

            windowManager.openWindow("/library/simplicity/components/form/mat-editor/dialog/image-upload-dialog", options).then((matWindow) => {
                matWindow.addEventListener("ok", (event) => {
                    let value = event.target.contents.value;
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(rangeAt);
                    document.execCommand("insertImage", false, value.data);
                    matWindow.close();
                })
            })
        },
        handler: (event) => {

        }
    }
    horizontalRule = {
        active: false,
        click(event) {
            document.execCommand("insertHorizontalRule")
        },
        handler(event) {

        }
    }
    text = {
        active: false,
        click(event) {
            let selection = document.getSelection();
            let rangeAt = selection.getRangeAt(0);

            let options = {
                width: "640px",
                height: "480px",
                header: "Text import"
            };

            windowManager.openWindow("/library/simplicity/components/form/mat-editor/dialog/text-dialog", options).then((matWindow) => {
                matWindow.addEventListener("ok", (event) => {
                    let value = event.target.contents.value;
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(rangeAt);
                    document.execCommand("insertText", false, value);
                    matWindow.close();
                })
            });
        },
        handler(event) {

        }
    }
    orderedList = {
        active: false,
        click(event) {
            document.execCommand("insertOrderedList")
        },
        handler(event) {

        }
    }
    unOrderedList = {
        active: false,
        click(event) {
            document.execCommand("insertUnorderedList")
        },
        handler(event) {

        }
    }
    paragraph = {
        active: false,
        click(event) {
            document.execCommand("insertParagraph")
        },
        handler(event) {

        }
    }

    inputs = [this.link, this.unLink, this.image, this.horizontalRule, this.text, this.orderedList, this.unOrderedList, this.paragraph];

    initialize() {
        let handler = (event) => {
            for (const input of this.inputs) {
                input.handler(event)
            }
        }

        this.contents.addEventListener("click", handler);

        ToolbarInserts.prototype.destroy = () => {
            this.contents.removeEventListener("click", handler);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "contents" : {
                this.contents = newValue;
            }
        }
    }

    static get components() {
        return []
    }

    static get observedAttributes() {
        return [{
            name: "contents",
            type: "input"
        }]
    }

    static get template() {
        return loader("library/simplicity/components/form/mat-editor/toolbar/toolbar-inserts.html")
    }

}

export default customComponents.define("toolbar-inserts", ToolbarInserts)