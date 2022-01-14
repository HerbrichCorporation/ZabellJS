import {register} from "./manager/view-manager.js";
import {codeGenerator, compiler, membraneFactory} from "./processors/html-compiler-processor.js";
import {appManager} from "./manager/app-manager.js";
import {contentManager} from "./manager/content-manager.js";

Object.prototype.equals = function (lhs, rhs) {
    if (lhs instanceof Object && rhs instanceof Object) {
        lhs = lhs.resolve || lhs;
        rhs = rhs.resolve || rhs;
        return lhs === rhs;
    }
    return lhs === rhs;
}

export function isEqual(lhs, rhs) {
    if (lhs instanceof Array && rhs instanceof Array) {
        if (lhs && rhs && lhs.length === rhs.length) {
            for (let i = 0; i < lhs.length; i++) {
                const lh = lhs[i];
                const rh = rhs[i];
                if (! Object.equals(lh,rh)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    } else if (lhs instanceof Object && rhs instanceof Object) {
        let lhsProperties = Object.keys(lhs);
        let rhsProperties = Object.keys(rhs);
        if (lhsProperties.length === 0 && rhsProperties.length === 0) {
            return true;
        }
        for (let i = 0; i < lhsProperties.length; i++) {
            const lhsProperty = lhsProperties[i];
            const rhsProperty = rhsProperties[i];

            if (! isEqual(lhs[lhsProperty], rhs[rhsProperty])) {
                return false
            }
        }

        return true;
    } else {
        return Object.equals(lhs, rhs);
    }
}

Node.prototype.queryUpwards = function (callback) {
    if (callback(this)) {
        return this;
    } else {
        if (this.parentElement === null) {
            return null;
        }
        return this.parentElement.queryUpwards(callback);
    }
}

const names = new Map();

export const customComponents = new class CustomComponents {

    define(name, clazz, options) {

        let fragments = new WeakMap();
        let html = clazz.template;
        let template;
        let i18nMessages = {};

        if (html) {
            if (clazz.components) {
                checker(clazz.components, clazz.template, name)
            }

            let templateHMTL = html.querySelector("template");
            template = codeGenerator(templateHMTL.content.children);

            let css = html.querySelector("style");
            if (css) {
                document.head.appendChild(css);
            }

            let scriptElement = html.querySelector("script");
            if (scriptElement) {
                let textContent = scriptElement.textContent.replaceAll(/\s+/g, " ");
                let rawMessagesFunction = eval("(" + textContent + ")")
                let rawMessages = rawMessagesFunction();
                for (const rawMessage of rawMessages) {
                    let message = i18nMessages[rawMessage["en"]] = {}
                    message["de"] = rawMessage["de"];
                }
            }
        }

        class SimplicityComponent extends clazz {

            initialized = false;

            constructor() {
                super();
            }

            i18n(text) {
                let language = appManager.language;
                if (language === "en") {
                    return text;
                } else {
                    let i18nMessage = i18nMessages[text];
                    if (i18nMessage) {
                        return i18nMessage[language]
                    }
                    return text;
                }
            }

            cycle() {
                let fragment = fragments.get(this);
                if (fragment) {
                    fragment.update();
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (!isEqual(oldValue, newValue)) {
                    this.attributesChanged = true;
                    super.attributeChangedCallback(name, oldValue, newValue)
                }
            }

            connectedCallback() {
                if (! this.initialized && this.isConnected) {
                    this.initialized = true;
                    if (template) {
                        let activeContentTemplate = (implicit) => contentManager.instance(this, implicit)

                        if (Reflect.has(this, "preInitialize")) {
                            membraneFactory(this).preInitialize();
                        }

                        let fragment = compiler(template, this, activeContentTemplate);

                        fragments.set(this, fragment);

                        this.appendChild(fragment);
                    }

                    if (Reflect.has(this, "initialize")) {
                        membraneFactory(this).initialize();
                    }
                }
            }

            disconnectedCallback() {
                if (this.initialized) {
                    if (super.destroy) {
                        super.destroy();
                    }
                }
            }

            static get observedAttributes() {
                if (super.observedAttributes) {
                    let observedAttributes = super.observedAttributes;
                    return observedAttributes.map((attribute => attribute.name))
                } else {
                    return [];
                }
            }

            static get observedBindAttributes() {
                if (super.observedAttributes) {
                    return super.observedAttributes;
                } else {
                    return [];
                }
            }


        }

        customElements.define(name, SimplicityComponent, options)
        names.set(SimplicityComponent, name);

        return SimplicityComponent;
    }

}

export const customViews = new class CustomViews {
    define(configuration) {

        register(configuration.name, configuration)

        return customComponents.define(configuration.name, configuration.class)
    }
}

function checker(jsImports, html, path) {
    if (html) {
        let components = [];

        function traverse(elements) {
            for (const element of elements) {
                if (element.localName.indexOf("-") > -1) {
                    let name = element.localName;
                    if (components.indexOf(name) === -1) {
                        components.push(name);
                    }
                }
                if (element.hasAttribute("is")) {
                    let name = element.getAttribute("is");
                    if (!name.startsWith("native")) {
                        if (components.indexOf(name) === -1) {
                            components.push(name);
                        }
                    }
                }

                if (element instanceof HTMLTemplateElement && element.hasAttribute("is")) {
                    traverse(element.content.children)
                }

                traverse(element.children);
            }
        }

        traverse(html.children);

        let sortedComponents = components.sort();
        let sortedJsImports = jsImports.map(item => names.get(item)).sort();

        if (!isEqual(sortedComponents, sortedJsImports)) {
            let toMuch = sortedJsImports.filter((importz) => sortedComponents.indexOf(importz) === -1);
            let missing = sortedComponents.filter((component) => sortedJsImports.indexOf(component) === -1)

            console.log(`path: ${path} toMuch : ${toMuch.join(", ")} missing:  ${missing.join(", ")}`)
        }

    }
}