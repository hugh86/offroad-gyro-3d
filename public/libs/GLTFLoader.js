// GLTFLoader.js
//
// Note: This version assumes you have `three.module.js` in the same folder (`./libs`).
// The import of THREE is relative now, not a bare specifier.

import * as THREE from './three.module.js';

class GLTFLoader extends THREE.Loader {

  constructor(manager) {
    super(manager);

    this.dracoLoader = null;
    this.pluginCallbacks = [];

    this.register(function (parser) {
      return {
        extensions: parser.extensions,
        decodePrimitive: parser.decodePrimitive.bind(parser),
      };
    });
  }

  load(url, onLoad, onProgress, onError) {
    const scope = this;

    const resourcePath = url ? THREE.LoaderUtils.extractUrlBase(url) : '';

    const loader = new THREE.FileLoader(this.manager);
    loader.setResponseType('arraybuffer');
    loader.load(url, function (data) {
      try {
        scope.parse(data, resourcePath, onLoad, onError);
      } catch (e) {
        if (onError) {
          onError(e);
        } else {
          console.error(e);
        }
        scope.manager.itemError(url);
      }
    }, onProgress, onError);
  }

  parse(data, path, onLoad, onError) {
    // Simplified example; real GLTFLoader has complex parsing code here
    // For brevity, this is a placeholder showing the usage of THREE

    const json = JSON.parse(new TextDecoder().decode(new Uint8Array(data)));

    // Create a scene object for demonstration:
    const scene = new THREE.Group()
    // Actual implementation would convert glTF data into THREE.js objects here

    if (onLoad) onLoad({ scene: scene });
  }

  setDRACOLoader(dracoLoader) {
    this.dracoLoader = dracoLoader;
    return this;
  }

  register(callback) {
    this.pluginCallbacks.push(callback);
    return this;
  }
}

export { GLTFLoader };
