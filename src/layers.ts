import {MAPPER_DEPENDENCY_SUFFIX, SERVICE_DEPENDENCY_SUFFIX, STORAGE_DEPENDENCY_SUFFIX} from '@Const/layers'

const to = require('to-case')

/**
 * This type describes existing model layers.
 * It constraints key of SystemLayers type and SYSTEM_LAYERS object for convenience.
 */
type LayerNames =
  'auth' |
  'config' |
  'fetcher' |
  'user'

/**
 * This array of layer names is used to build SYSTEM_LAYERS object.
 * Layer names should be duplicated for convenience.
 * @type {(string)[]}
 */
const LAYERS: LayerNames[] = [
  'auth',
  'config',
  'fetcher',
  'user'
]

class Layer {

  private get registrationName(): string {
    return to.pascal(this.layerName)
  }

  public get storageName() {
    return this.registrationName + STORAGE_DEPENDENCY_SUFFIX
  }

  public get serviceName() {
    return this.registrationName + SERVICE_DEPENDENCY_SUFFIX
  }

  public get mapperName() {
    return this.registrationName + MAPPER_DEPENDENCY_SUFFIX
  }

  constructor(private layerName: LayerNames) {
  }
}

type SystemLayers = {
  [key in LayerNames]: Layer
}

export const SYSTEM_LAYERS: SystemLayers = LAYERS.reduce((previous, current) => {
  previous[current] = new Layer(current)
  return previous
}, {} as SystemLayers)
