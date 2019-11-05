import {Resolution, ResolutionType} from '@App/enum/resolution'
import {FormikProps} from 'formik'

/**
 * Utility function getWindowResolution returns current screen width
 * @returns {ResolutionType} Enum returned from the function according screen width
 */

export const getWindowResolution = (): ResolutionType => (
  window.innerWidth < Resolution.large ? ResolutionType.mobile : ResolutionType.desktop
)

/**
 * Utility function debounce allows you to call a function after a certain period of time
 * @param {() => void} fn Function to be called
 * @param {number} ms Debounce time
 * @returns {() => void} Function returned from the function to be assigned to the variable
 */

export const debounce = (fn: () => void, ms: number): () => void => {
  let isCoolDown = false
  return () => {
    if (!isCoolDown) {
      fn()
      isCoolDown = true
      setTimeout(() => isCoolDown = false, ms)
    }
  }
}

/**
 * Utility function isFormikFormValid force trigger validation of the entire "Formik" form and returns form state.
 * The function must be called after the asynchronous "handleChange" "Formik" method.
 *
 * @param {FormikProps<T>} formikProps Formik Props
 * @returns {Promise<boolean>} Function returned the form is valid or not
 */

export const isFormikFormValid = async <T>(formikProps: FormikProps<T>): Promise<boolean> => {
  const result = await formikProps.validateForm()
  return !Object.keys(result).length
}
