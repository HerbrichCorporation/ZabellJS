import {customComponents} from "../simplicity.js";

class DomRepeat extends HTMLTemplateElement {

    item
    items = [];

    initialize() {
        this.render();
    }

    render() {
        let sibling = this.nextElementSibling;
        while (sibling) {
            let nextElementSibling = sibling.nextElementSibling;
            if (sibling.context?.indexOf("repeat") > -1) {
                sibling.remove();
            }
            sibling = nextElementSibling
        }

        let container = document.createDocumentFragment();

        this.items.forEach((item, index) => {
            let child = this.content.firstElementChild;

            let importNode = document.importNode(child, true);

            importNode[this.item] = item;
            importNode.index = index;
            importNode.length = this.items.length;
            importNode.context = importNode.context || [];
            importNode.context.push("repeat");

            container.appendChild(importNode, false)
        })

        this.after(container)

        this.dispatchEvent(new CustomEvent("repeat"))

    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "items" : {
                this.items = newValue;
            }
                break;
            case "item" : {
                this.item = newValue;
            }
                break;
        }
    }

    static get observedAttributes() {
        return [
            {
                name: "items",
                type: "input"
            }, {
                name: "item",
                type: "input"
            }
        ]
    }

}

export default customComponents.define("dom-repeat", DomRepeat, {extends: "template"})