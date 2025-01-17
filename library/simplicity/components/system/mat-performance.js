import {customComponents} from "../../simplicity.js";
import {loader} from "../../processors/loader-processor.js";
import {appManager} from "../../manager/app-manager.js";

class MatPerformance extends HTMLElement {

    get performanceLifeCycle() {
        let latency = appManager.performance.lifeCycle.latency;
        let avgLatency = appManager.performance.lifeCycle.avgLatency;
        let result = [];
        for (let i = 0; i < latency.length; i++) {
            result.push({
                latency : Math.round(latency[i]) || 0,
                avgLatency : Math.round(avgLatency[i]) || 0
            })
        }
        return result;
    }

    get performancePageLoad() {
        let pageLoad = appManager.performance.pageLoad;
        return pageLoad.map((item) => Math.round(item))
    }

    static get components() {
        return []
    }

    static get template() {
        return loader("library/simplicity/components/system/mat-performance.html")
    }

}

export default customComponents.define("mat-performance", MatPerformance)