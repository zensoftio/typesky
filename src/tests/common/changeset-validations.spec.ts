import 'mocha'
import ChangesetValidations from '../../common/changeset-validations'
import {Changeset} from '../../common/changeset'
import 'jsmockito'
import {anyString, anything} from 'ts-mockito'

const chai = require('chai')
// const chaiExclude = require('chai-exclude')
// chai.use(chaiExclude)

describe('Changeset Validations', () => {

  describe('Presence Validator', () => {

    let validationRule: Changeset.ValidationRule<any, keyof any, never>

    beforeEach(() => {
      validationRule = ChangesetValidations.validatePresence('test')
    })

    it('Regards null as invalid', () => {

      const validationResult = validationRule(null)

      chai.assert.isNotTrue(validationResult.valid)
      chai.assert.isNotEmpty(validationResult.error)
    })

    it('Regards undefined as invalid', () => {

      const validationResult = validationRule(undefined)

      chai.assert.isNotTrue(validationResult.valid)
      chai.assert.isNotEmpty(validationResult.error)
    })

    it('Regards empty object as invalid', () => {

      const validationResult = validationRule({})

      chai.assert.isNotTrue(validationResult.valid)
      chai.assert.isNotEmpty(validationResult.error)
    })

    it('Regards empty array as invalid', () => {

      const validationResult = validationRule([])

      chai.assert.isNotTrue(validationResult.valid)
      chai.assert.isNotEmpty(validationResult.error)
    })

    it('Regards empty string as invalid', () => {

      const validationResult = validationRule('')

      chai.assert.isNotTrue(validationResult.valid)
      chai.assert.isNotEmpty(validationResult.error)
    })

    it('Regards non-empty string as valid', () => {

      const validationResult = validationRule('test')

      chai.assert.isTrue(validationResult.valid)
    })

  })

  describe('Length Validator', () => {

    it('Throws error if length constraints are invalid', () => {

      chai.assert.throws(() => {
        ChangesetValidations.validateLength('test', {})
      })

      chai.assert.throws(() => {
        ChangesetValidations.validateLength('test', {allowEmpty: true})
      })

      chai.assert.throws(() => {
        ChangesetValidations.validateLength('test', {allowEmpty: false})
      })
    })

    it('Validates minimum length', () => {

      const validation = ChangesetValidations.validateLength('test', {min: 2})

      const validationResult1 = validation(null)

      chai.assert.isFalse(validationResult1.valid)

      const validationResult2 = validation('1')

      chai.assert.isFalse(validationResult2.valid)

      const validationResult3 = validation('test')

      chai.assert.isTrue(validationResult3.valid)
    })

    it('Validates minimum length and allows empty values if configured', () => {

      const validation = ChangesetValidations.validateLength('test', {min: 2, allowEmpty: true})

      const validationResult1 = validation(null)

      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validation('')

      chai.assert.isTrue(validationResult2.valid)

      const validationResult3 = validation('1')

      chai.assert.isFalse(validationResult3.valid)

      const validationResult4 = validation('test')

      chai.assert.isTrue(validationResult4.valid)
    })

    it('Validates maximum length', () => {

      const validation = ChangesetValidations.validateLength('test', {max: 2})

      const validationResult1 = validation(null)

      chai.assert.isFalse(validationResult1.valid)

      const validationResult2 = validation('1')

      chai.assert.isTrue(validationResult2.valid)

      const validationResult3 = validation('test')

      chai.assert.isFalse(validationResult3.valid)
    })

    it('Validates maximum length and allows empty values if configured', () => {

      const validation = ChangesetValidations.validateLength('test', {max: 2, allowEmpty: true})

      const validationResult1 = validation(null)

      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validation('')

      chai.assert.isTrue(validationResult2.valid)

      const validationResult3 = validation('1')

      chai.assert.isTrue(validationResult3.valid)

      const validationResult4 = validation('test')

      chai.assert.isFalse(validationResult4.valid)
    })

    it('Validates minimum and maximum length', () => {

      const validation = ChangesetValidations.validateLength('test', {min: 2, max: 4})

      const validationResult1 = validation(null)

      chai.assert.isFalse(validationResult1.valid)

      const validationResult2 = validation('1')

      chai.assert.isFalse(validationResult2.valid)

      const validationResult3 = validation('123')

      chai.assert.isTrue(validationResult3.valid)

      const validationResult4 = validation('12345')

      chai.assert.isFalse(validationResult4.valid)
    })

    it('Validates minimum and maximum length and allows empty values if configured', () => {

      const validation = ChangesetValidations.validateLength('test', {min: 2, max: 4, allowEmpty: true})

      const validationResult1 = validation(null)

      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validation('')

      chai.assert.isTrue(validationResult2.valid)

      const validationResult3 = validation('1')

      chai.assert.isFalse(validationResult3.valid)

      const validationResult4 = validation('123')

      chai.assert.isTrue(validationResult4.valid)

      const validationResult5 = validation('12345')

      chai.assert.isFalse(validationResult5.valid)
    })
  })

  describe('Format Validator', () => {

    it('Validates arbitrary format', () => {

      const validationRule = ChangesetValidations.validateFormat('test', 'test')

      const validationResult1 = validationRule('test')
      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validationRule('not-correct')
      chai.assert.isFalse(validationResult2.valid)
    })

    it('Validates arbitrary format by regular expressions', () => {

      const validationRule = ChangesetValidations.validateFormat('test', '^tests?$')

      const validationResult1 = validationRule('test')
      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validationRule('tests')
      chai.assert.isTrue(validationResult2.valid)

      const validationResult3 = validationRule('tes ts')
      chai.assert.isFalse(validationResult3.valid)

      const validationResult4 = validationRule(' test')
      chai.assert.isFalse(validationResult4.valid)

      const validationResult5 = validationRule('test ')
      chai.assert.isFalse(validationResult5.valid)
    })

    it('Forbids empty values by default', () => {

      const validationRule = ChangesetValidations.validateFormat('test', 'test')

      const validationResult1 = validationRule(null)
      chai.assert.isFalse(validationResult1.valid)

      const validationResult2 = validationRule('')
      chai.assert.isFalse(validationResult2.valid)
    })

    it('Allows empty values when configured to do so', () => {

      const validationRule = ChangesetValidations.validateFormat('test', 'test', true)

      const validationResult1 = validationRule(null)
      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validationRule('')
      chai.assert.isTrue(validationResult2.valid)
    })
  })

  describe('Email Validator', () => {

    const INVALID_EMAIL_EXAMPLES = [
      ' test@test.io',
      'test@test.io ',
      'test @test.io',
      'test@ test.io ',
      'test@test .io ',
      'test@test. io ',
      'test@test.io123',
      '@test.io',
      'test@test',
      'test@',
      'test.test',
      'test@test.123',
      'te\\st@test.io',
      'te@st@test.io',
      'te)st@test.io',
      'te(st@test.io',
      'test@te/st.io',
      'test@te|st.io',
      'test@te&st.io',
      'test@te*st.io',
      'test@te(st.io',
      'test@te)st.io',
      'test@te_st.io',
      'test@te=st.io'
    ]

    const VALID_EMAIL_EXAMPLES = [
      'test@test.io',
      'te-st@test.io',
      'test@te-st.io',
      'te-st@te-st.io',
      'te/st@test.io',
      'te|st@test.io',
      'te!st@test.io',
      'te#st@test.io',
      'te$st@test.io',
      'te%st@test.io',
      'te^st@test.io',
      'te&st@test.io',
      'te*st@test.io',
      'te_st@test.io',
      'te=st@test.io',
      'te+st@test.io',
      'test@test.com.io',
      'test.text@test.io',
      'test.text@test.com.io'
    ]

    it('Validates email format', () => {

      const validationRule = ChangesetValidations.validateEmail('test')

      INVALID_EMAIL_EXAMPLES.forEach((email => {
        const validationResult = validationRule(email)
        chai.assert.isFalse(validationResult.valid)
      }))

      VALID_EMAIL_EXAMPLES.forEach((email => {
        const validationResult = validationRule(email)
        chai.assert.isTrue(validationResult.valid)
      }))
    })

    it('Forbids empty values by default', () => {

      const validationRule = ChangesetValidations.validateEmail('test')

      const validationResult1 = validationRule(null)
      chai.assert.isFalse(validationResult1.valid)

      const validationResult2 = validationRule('')
      chai.assert.isFalse(validationResult2.valid)
    })

    it('Allows empty values when configured to do so', () => {

      const validationRule = ChangesetValidations.validateEmail('test', true)

      const validationResult1 = validationRule(null)
      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validationRule('')
      chai.assert.isTrue(validationResult2.valid)
    })
  })

  describe('Url Validator', () => {

    const INVALID_URL_EXAMPLES = [
      'ftp://test.io',
      ' http://test.io',
      'http://test.io ',
      'http://test. io',
      'http//test.io',
      'httpss://test.io',
      'http:/test.io',
      'http:!//test.io',
      'http:/!/test.io',
      'http://!test.io',
      'io'
    ]

    const VALID_URL_EXAMPLES = [
      'www.test.io',
      'http://www.test.io',
      'https://www.test.io',
      'test.io',
      'http://test.io',
      'https://test.io',
      'https://test.io/',
      'https://test.io/abc',
      'https://test.io/abc/123',
      'https://test.io?a=b',
      'https://test.io/?a=b',
      'https://test.io?a=b&c=d',
      'https://test.io#test',
      'https://test.io/abc#test',
      'https://test.io/abc/#test',
      'https://test.io/abc?a=b#test',
      'https://test.io/abc/?a=b#test'
    ]

    it('Validates url format', () => {

      const validationRule = ChangesetValidations.validateUrl('test')

      INVALID_URL_EXAMPLES.forEach((url => {
        const validationResult = validationRule(url)
        chai.assert.isFalse(validationResult.valid)
      }))

      VALID_URL_EXAMPLES.forEach((url => {
        const validationResult = validationRule(url)
        chai.assert.isTrue(validationResult.valid)
      }))
    })

    it('Forbids empty values by default', () => {

      const validationRule = ChangesetValidations.validateUrl('test')

      const validationResult1 = validationRule(null)
      chai.assert.isFalse(validationResult1.valid)

      const validationResult2 = validationRule('')
      chai.assert.isFalse(validationResult2.valid)
    })

    it('Allows empty values when configured to do so', () => {

      const validationRule = ChangesetValidations.validateUrl('test', true)

      const validationResult1 = validationRule(null)
      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validationRule('')
      chai.assert.isTrue(validationResult2.valid)
    })
  })

  describe('Array Validator', () => {

    it('Uses passed validator to test individual values in array', () => {

      // const mockValidator = JsMockito.mockFunction()
      //
      // JsMockito.when(mockValidator).call(anything(), 'test', anyString()).thenReturn({valid: true})
      // JsMockito.when(mockValidator).call(anything(), 'foo', anyString()).thenReturn({valid: true})
      // JsMockito.when(mockValidator).call(anything(), 'bar', anyString()).thenReturn({valid: true})
      // JsMockito.when(mockValidator).call(anything(), 'invalid', anyString()).thenReturn({valid: false})
      //
      // const validationRule = ChangesetValidations.validateArray('test', mockValidator as any)
      //
      // const validationResult = validationRule(['test', 'foo', 'bar', 'invalid'], 'Not a changeset' as any)
      //
      // chai.assert.isFalse(validationResult.valid)
    })

  })

  describe('String Array Length Validator', () => {

    it('Throws error if length constraints are invalid', () => {

      chai.assert.throws(() => {
        ChangesetValidations.validateStringArrayLength('test', {})
      })

      chai.assert.throws(() => {
        ChangesetValidations.validateStringArrayLength('test', {allowEmpty: true})
      })

      chai.assert.throws(() => {
        ChangesetValidations.validateStringArrayLength('test', {allowEmpty: false})
      })
    })

    it('Validates minimum length', () => {

      const validation = ChangesetValidations.validateStringArrayLength('test', {min: 2})

      const validationResult1 = validation(null)

      chai.assert.isFalse(validationResult1.valid)

      const validationResult2 = validation(['1'])

      chai.assert.isFalse(validationResult2.valid)
      chai.assert.isTrue(validationResult2.meta === 0)

      const validationResult3 = validation(['test'])

      chai.assert.isTrue(validationResult3.valid)

      const validationResult4 = validation(['test', ''])

      chai.assert.isFalse(validationResult4.valid)
      chai.assert.isTrue(validationResult4.meta === 1)
    })

    it('Validates minimum length and allows empty values if configured', () => {

      const validation = ChangesetValidations.validateStringArrayLength('test', {min: 2, allowEmpty: true})

      const validationResult1 = validation(null)

      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validation([''])

      chai.assert.isTrue(validationResult2.valid)

      const validationResult3 = validation(['1'])
      chai.assert.isTrue(validationResult3.meta === 0)

      chai.assert.isFalse(validationResult3.valid)

      const validationResult4 = validation(['test'])

      chai.assert.isTrue(validationResult4.valid)

      const validationResult5 = validation(['test', ''])

      chai.assert.isTrue(validationResult5.valid)

      const validationResult6 = validation(['test', '1'])

      chai.assert.isFalse(validationResult6.valid)
    })

    it('Validates maximum length', () => {

      const validation = ChangesetValidations.validateStringArrayLength('test', {max: 2})

      const validationResult1 = validation(null)

      chai.assert.isFalse(validationResult1.valid)

      const validationResult2 = validation([''])

      chai.assert.isFalse(validationResult2.valid)
      chai.assert.isTrue(validationResult2.meta === 0)

      const validationResult3 = validation(['test'])

      chai.assert.isFalse(validationResult3.valid)
      chai.assert.isTrue(validationResult3.meta === 0)

      const validationResult4 = validation(['1', 'test'])

      chai.assert.isFalse(validationResult4.valid)
      chai.assert.isTrue(validationResult4.meta === 1)
    })

    it('Validates maximum length and allows empty values if configured', () => {

      const validation = ChangesetValidations.validateStringArrayLength('test', {max: 2, allowEmpty: true})

      const validationResult1 = validation(null)

      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validation([''])

      chai.assert.isTrue(validationResult2.valid)

      const validationResult3 = validation(['1'])

      chai.assert.isTrue(validationResult3.valid)

      const validationResult4 = validation(['1', ''])

      chai.assert.isTrue(validationResult4.valid)

      const validationResult5 = validation(['test'])

      chai.assert.isFalse(validationResult5.valid)
      chai.assert.isTrue(validationResult5.meta === 0)

      const validationResult6 = validation(['1', 'test'])

      chai.assert.isFalse(validationResult6.valid)
      chai.assert.isTrue(validationResult6.meta === 1)
    })

    it('Validates minimum and maximum length', () => {

      const validation = ChangesetValidations.validateStringArrayLength('test', {min: 2, max: 4})

      const validationResult1 = validation(null)

      chai.assert.isFalse(validationResult1.valid)

      const validationResult2 = validation(['1'])

      chai.assert.isFalse(validationResult2.valid)

      const validationResult3 = validation([''])

      chai.assert.isFalse(validationResult3.valid)

      const validationResult4 = validation(['123'])

      chai.assert.isTrue(validationResult4.valid)

      const validationResult5 = validation(['123', ''])

      chai.assert.isFalse(validationResult5.valid)
      chai.assert.isTrue(validationResult5.meta === 1)

      const validationResult6 = validation(['12345'])

      chai.assert.isFalse(validationResult6.valid)
    })

    it('Validates minimum and maximum length and allows empty values if configured', () => {

      const validation = ChangesetValidations.validateStringArrayLength('test', {min: 2, max: 4, allowEmpty: true})

      const validationResult1 = validation(null)

      chai.assert.isTrue(validationResult1.valid)

      const validationResult2 = validation([''])

      chai.assert.isTrue(validationResult2.valid)

      const validationResult3 = validation(['1'])

      chai.assert.isFalse(validationResult3.valid)
      chai.assert.isTrue(validationResult3.meta === 0)

      const validationResult4 = validation(['123'])

      chai.assert.isTrue(validationResult4.valid)

      const validationResult5 = validation(['123', ''])

      chai.assert.isTrue(validationResult5.valid)

      const validationResult6 = validation(['123', '1'])

      chai.assert.isFalse(validationResult6.valid)
      chai.assert.isTrue(validationResult6.meta === 1)

      const validationResult7 = validation(['12345'])

      chai.assert.isFalse(validationResult7.valid)
      chai.assert.isTrue(validationResult7.meta === 0)
    })

  })

  describe('Optional Validator', () => {

    it('Uses passed condition and validator', () => {

    })

  })

  describe('Conditional Validator', () => {

    it('Uses passed condition and validators', () => {

    })

  })

  describe('Compound Validator', () => {

    it('Calls all passed validators', () => {

    })

  })

  describe('Always Valid Validator', () => {

    let validationRule: Changeset.ValidationRule<any, keyof any, never>

    beforeEach(() => {
      validationRule = ChangesetValidations.validateAlwaysValid()
    })

    it('Regards false values as valid', () => {

      const validationResult = validationRule(false)

      chai.assert.isTrue(validationResult.valid, 'This validator should regard any values as valid')
    })

    it('Regards null values as valid', () => {

      const validationResult = validationRule(null)

      chai.assert.isTrue(validationResult.valid, 'This validator should regard any values as valid')
    })

    it('Regards undefined values as valid', () => {

      const validationResult = validationRule(undefined)

      chai.assert.isTrue(validationResult.valid, 'This validator should regard any values as valid')
    })

    it('Regards empty arrays as valid', () => {

      const validationResult = validationRule([])

      chai.assert.isTrue(validationResult.valid, 'This validator should regard any values as valid')
    })

    it('Regards objects as valid', () => {

      const validationResult = validationRule({})

      chai.assert.isTrue(validationResult.valid)
    })

    it('Regards lambdas as valid', () => {

      const validationResult = validationRule(() => false)

      chai.assert.isTrue(validationResult.valid)
    })

    it('Regards empty string as valid', () => {

      const validationResult = validationRule('')

      chai.assert.isTrue(validationResult.valid)
    })

  })
})
