import {layers} from '../layers'

const loader = (f: (name: string) => Promise<any>) =>
  (className: string[]) => Promise.all(className.map(f)
                                                .map(it => it.catch(() => Promise.resolve())))
                                  .then(it => it.filter(it => !!it))

/**
 * we need to hard code import pathes for webpack
 */

const storesLoader = loader(it => import(`../stores/impl/${it}`))

const servicesLoader = loader(it => import(`../services/impl/${it}`))

const fetchersLoader = loader(it => import(`../fetchers/impl/${it}`))

const mappersLoader = loader(it => import(`../mappers/impl/${it}`))

const loadAll = [
  storesLoader(layers), servicesLoader(layers), fetchersLoader(layers), mappersLoader(layers)
]

export const classLoader = () => Promise.all(loadAll)
                                        .then(it => it.reduce((acc, it) => acc.concat(it), []))