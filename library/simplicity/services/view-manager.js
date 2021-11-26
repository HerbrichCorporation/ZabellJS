const registry = new Map();

let lastRouteRegistry = new Map();

export const viewManager = new class ViewManager {
    load(url, level = 0) {
        let executor = (resolve, reject) => {
            console.time("load")

            let segments = url.split("#");

            if (segments.length === 1) {
                return;
            }

            let hash = segments[level + 1];
            if (hash) {
                let indexOf = hash.indexOf("?");
                let hashes, path;
                if (indexOf === -1) {
                    hashes = [hash]
                    path = hash;
                } else {
                    hashes = [hash.substring(0, indexOf), hash.substring(indexOf + 1)];
                    path = hashes[0];
                }

                let result = {};
                if (hashes[1]) {
                    let rawQueryParams = hashes[1].split("&");
                    for (const rawQueryParam of rawQueryParams) {
                        let queryParamRegex = /(\w+)=([\w\d\-/?=]*)/g;
                        let queryParameterRegexResult = queryParamRegex.exec(rawQueryParam);
                        result[queryParameterRegexResult[1]] = queryParameterRegexResult[2]
                    }
                }

                let newPath = "../../.." + path + ".js";
                import(newPath)
                    .then((module) => {
                        let view;
                        view = new module.default();
                        this.loadGuards(view, result).then(() => {
                            resolve(view);
                            console.timeEnd("load");
                        })
                    })
                    .catch((result) => {
                        console.log(result)
                    })

            }
        }

        return new Promise(executor);
    }

    loadGuards(view, result = {}) {
        let executor = (resolve, reject) => {
            view.queryParams = result;

            let configure = get(view.localName);

            if (configure.guard) {

                view.reload = () => {
                    let target = configure.guard(view);

                    let guardResult = Reflect.ownKeys(target);

                    let promises = [];
                    for (const property of guardResult) {
                        let guardResultElement = target[property];
                        promises.push(guardResultElement);
                    }

                    return Promise.all(promises).then((results) => {
                        guardResult.forEach((property, index) => {
                            view[property] = results[index];
                        });
                    })
                }

                view.reload().then(() => {
                    resolve();
                })

            } else {
                resolve();
            }
        };

        return new Promise(executor);
    }
}

export function register(name, guard) {
    registry.set(name, guard)
}

export function get(name) {
    return registry.get(name);
}