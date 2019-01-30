import {layers} from '../layers'

const implementationName = 'default'

const systemLayers = [implementationName]

const layerList = systemLayers.concat(layers)

const loader = (f: (name: string) => Promise<any>) =>
  (className: string[]) => Promise.all(className.map(f)
    .map(it => it.catch(() => Promise.resolve())))
    .then(it => it.filter(it => !!it))

/**
 * we need to hard code import pathes for webpack
 */

const servicesLoader = loader(it => import(`../services/${it}/${implementationName}`))

const fetchersLoader = loader(it => import(`../fetchers/impl/${it}`))

const mappersLoader = loader(it => import(`../mappers/${it}/${implementationName}`))

const storagesLoader = loader(it => import(`../storages/${it}/${implementationName}`))

const loadAll = [
  servicesLoader(layerList), fetchersLoader(layerList), mappersLoader(layerList), storagesLoader(layerList)
]

export const dependencyRegistration = () => Promise.all(loadAll)
  .then(it => it.reduce((acc, it) => acc.concat(it), []))
