import * as i18next from 'i18next'
import * as Backend from 'i18next-xhr-backend'

const context: any = {resolve: null}

export const translationReady = new Promise(resolve => context.resolve = resolve)

const i18n = i18next.use(Backend)
                    .init(
                      {
                        backend: {
                          loadPath: '/locales/{{lng}}/{{ns}}.json'
                        }
                      }, () => context.resolve()
                    )

export default i18n
