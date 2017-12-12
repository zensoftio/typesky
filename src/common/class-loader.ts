import {layers} from '../layers'

const systemLayers = ['fetch', 'default']

const layerList = systemLayers.concat(layers)

const loader = (f: (name: string) => Promise<any>) =>
  (className: string[]) => Promise.all(className.map(f)
                                                .map(it => it.catch(() => Promise.resolve())))
                                  .then(it => it.filter(it => !!it))

/**
 * we need to hard code import pathes for webpack
 */

const servicesLoader = loader(it => import(`../services/impl/${it}`))

const fetchersLoader = loader(it => import(`../fetchers/impl/${it}`))

const mappersLoader = loader(it => import(`../mappers/impl/${it}`))

const storagesLoader = loader(it => import(`../storages/impl/${it}`))

const loadAll = [
  servicesLoader(layerList), fetchersLoader(layerList), mappersLoader(layerList), storagesLoader(layerList)
]

export const classLoader = () => Promise.all(loadAll)
                                        .then(it => it.reduce((acc, it) => acc.concat(it), []))
