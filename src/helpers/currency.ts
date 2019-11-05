import {Currency} from '@App/enum/currency'

export const getCurrencySign = (currency: string) => {
  if (currency === 'dollar') {
    return Currency.dollar
  }

  if (currency === 'euro') {
    return Currency.euro
  }

  if (currency === 'ruble') {
    return Currency.ruble
  }

  return Currency.ruble
}
