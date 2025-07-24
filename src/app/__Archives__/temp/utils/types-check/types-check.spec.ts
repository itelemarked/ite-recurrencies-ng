import { isPlainObject } from "../object/isPlainObject";
import { isArray, isBoolean, isValidDate, isFunction, isNull, isNumber, isString, isUndefined } from "./types-check";

describe('types-check', () => {

  describe('isString()', () => {
    it('argument: string', () => {
      const val = 'aaa'
      expect(isString(val)).toBeTruthy()
    })
    it('argument: number', () => {
      const val = 99
      expect(isString(val)).toBeFalsy()
    })
    it('argument: boolean', () => {
      const val = true
      expect(isString(val)).toBeFalsy()
    })
    it('argument: null', () => {
      const val = null
      expect(isString(val)).toBeFalsy()
    })
    it('argument: undefined', () => {
      const val = undefined
      expect(isString(val)).toBeFalsy()
    })
    it('argument: date', () => {
      const val = new Date()
      expect(isString(val)).toBeFalsy()
    })
    it('argument: array', () => {
      const val = [1,2,3]
      expect(isString(val)).toBeFalsy()
    })
    it('argument: function', () => {
      const val = () => {}
      expect(isString(val)).toBeFalsy()
    })
    it('argument: plainObject', () => {
      const val = {}
      expect(isString(val)).toBeFalsy()
    })
  })

  describe('isNumber()', () => {
    it('argument: string', () => {
      const val = 'aaa'
      expect(isNumber(val)).toBeFalsy()
    })
    it('argument: number', () => {
      const val = 99
      expect(isNumber(val)).toBeTruthy()
    })
    it('argument: boolean', () => {
      const val = true
      expect(isNumber(val)).toBeFalsy()
    })
    it('argument: null', () => {
      const val = null
      expect(isNumber(val)).toBeFalsy()
    })
    it('argument: undefined', () => {
      const val = undefined
      expect(isNumber(val)).toBeFalsy()
    })
    it('argument: date', () => {
      const val = new Date()
      expect(isNumber(val)).toBeFalsy()
    })
    it('argument: array', () => {
      const val = [1,2,3]
      expect(isNumber(val)).toBeFalsy()
    })
    it('argument: function', () => {
      const val = () => {}
      expect(isNumber(val)).toBeFalsy()
    })
    it('argument: plainObject', () => {
      const val = {}
      expect(isNumber(val)).toBeFalsy()
    })
  })

  describe('isBoolean()', () => {
    it('argument: string', () => {
      const val = 'aaa'
      expect(isBoolean(val)).toBeFalsy()
    })
    it('argument: number', () => {
      const val = 99
      expect(isBoolean(val)).toBeFalsy()
    })
    it('argument: boolean', () => {
      const val = true
      expect(isBoolean(val)).toBeTruthy()
    })
    it('argument: null', () => {
      const val = null
      expect(isBoolean(val)).toBeFalsy()
    })
    it('argument: undefined', () => {
      const val = undefined
      expect(isBoolean(val)).toBeFalsy()
    })
    it('argument: date', () => {
      const val = new Date()
      expect(isBoolean(val)).toBeFalsy()
    })
    it('argument: array', () => {
      const val = [1,2,3]
      expect(isBoolean(val)).toBeFalsy()
    })
    it('argument: function', () => {
      const val = () => {}
      expect(isBoolean(val)).toBeFalsy()
    })
    it('argument: plainObject', () => {
      const val = {}
      expect(isBoolean(val)).toBeFalsy()
    })
  })

  describe('isNull()', () => {
    it('argument: string', () => {
      const val = 'aaa'
      expect(isNull(val)).toBeFalsy()
    })
    it('argument: number', () => {
      const val = 99
      expect(isNull(val)).toBeFalsy()
    })
    it('argument: boolean', () => {
      const val = true
      expect(isNull(val)).toBeFalsy()
    })
    it('argument: null', () => {
      const val = null
      expect(isNull(val)).toBeTruthy()
    })
    it('argument: undefined', () => {
      const val = undefined
      expect(isNull(val)).toBeFalsy()
    })
    it('argument: date', () => {
      const val = new Date()
      expect(isNull(val)).toBeFalsy()
    })
    it('argument: array', () => {
      const val = [1,2,3]
      expect(isNull(val)).toBeFalsy()
    })
    it('argument: function', () => {
      const val = () => {}
      expect(isNull(val)).toBeFalsy()
    })
    it('argument: plainObject', () => {
      const val = {}
      expect(isNull(val)).toBeFalsy()
    })
  })

  describe('isUndefined()', () => {
    it('argument: string', () => {
      const val = 'aaa'
      expect(isUndefined(val)).toBeFalsy()
    })
    it('argument: number', () => {
      const val = 99
      expect(isUndefined(val)).toBeFalsy()
    })
    it('argument: boolean', () => {
      const val = true
      expect(isUndefined(val)).toBeFalsy()
    })
    it('argument: null', () => {
      const val = null
      expect(isUndefined(val)).toBeFalsy()
    })
    it('argument: undefined', () => {
      const val = undefined
      expect(isUndefined(val)).toBeTruthy()
    })
    it('argument: date', () => {
      const val = new Date()
      expect(isUndefined(val)).toBeFalsy()
    })
    it('argument: array', () => {
      const val = [1,2,3]
      expect(isUndefined(val)).toBeFalsy()
    })
    it('argument: function', () => {
      const val = () => {}
      expect(isUndefined(val)).toBeFalsy()
    })
    it('argument: plainObject', () => {
      const val = {}
      expect(isUndefined(val)).toBeFalsy()
    })
  })

  describe('isValidDate()', () => {
    it('argument: string', () => {
      const val = 'aaa'
      expect(isValidDate(val)).toBeFalsy()
    })
    it('argument: number', () => {
      const val = 99
      expect(isValidDate(val)).toBeFalsy()
    })
    it('argument: boolean', () => {
      const val = true
      expect(isValidDate(val)).toBeFalsy()
    })
    it('argument: null', () => {
      const val = null
      expect(isValidDate(val)).toBeFalsy()
    })
    it('argument: undefined', () => {
      const val = undefined
      expect(isValidDate(val)).toBeFalsy()
    })
    it('argument: date', () => {
      const val = new Date('any-invalid-date-parameter')
      expect(isValidDate(val)).toBeFalsy()
    })
    it('argument: date', () => {
      const val = new Date('2026-06-01')
      expect(isValidDate(val)).toBeTruthy()
    })
    it('argument: array', () => {
      const val = [1,2,3]
      expect(isValidDate(val)).toBeFalsy()
    })
    it('argument: function', () => {
      const val = () => {}
      expect(isValidDate(val)).toBeFalsy()
    })
    it('argument: plainObject', () => {
      const val = {}
      expect(isValidDate(val)).toBeFalsy()
    })
  })

  describe('isArray()', () => {
    it('argument: string', () => {
      const val = 'aaa'
      expect(isArray(val)).toBeFalsy()
    })
    it('argument: number', () => {
      const val = 99
      expect(isArray(val)).toBeFalsy()
    })
    it('argument: boolean', () => {
      const val = true
      expect(isArray(val)).toBeFalsy()
    })
    it('argument: null', () => {
      const val = null
      expect(isArray(val)).toBeFalsy()
    })
    it('argument: undefined', () => {
      const val = undefined
      expect(isArray(val)).toBeFalsy()
    })

    it('argument: date', () => {
      const val = new Date()
      expect(isArray(val)).toBeFalsy()
    })
    it('argument: array', () => {
      const val = [1,2,3]
      expect(isArray(val)).toBeTruthy()
    })
    it('argument: function', () => {
      const val = () => {}
      expect(isArray(val)).toBeFalsy()
    })
    it('argument: plainObject', () => {
      const val = {}
      expect(isArray(val)).toBeFalsy()
    })
  })

  describe('isFunction()', () => {
    it('argument: string', () => {
      const val = 'aaa'
      expect(isFunction(val)).toBeFalsy()
    })
    it('argument: number', () => {
      const val = 99
      expect(isFunction(val)).toBeFalsy()
    })
    it('argument: boolean', () => {
      const val = true
      expect(isFunction(val)).toBeFalsy()
    })
    it('argument: null', () => {
      const val = null
      expect(isFunction(val)).toBeFalsy()
    })
    it('argument: undefined', () => {
      const val = undefined
      expect(isFunction(val)).toBeFalsy()
    })
    it('argument: date', () => {
      const val = new Date()
      expect(isFunction(val)).toBeFalsy()
    })
    it('argument: array', () => {
      const val = [1,2,3]
      expect(isFunction(val)).toBeFalsy()
    })
    it('argument: function', () => {
      const val = () => {}
      expect(isFunction(val)).toBeTruthy()
    })
    it('argument: plainObject', () => {
      const val = {}
      expect(isFunction(val)).toBeFalsy()
    })
  })

  describe('isPlainObject()', () => {
    it('argument: string', () => {
      const val = 'aaa'
      expect(isPlainObject(val)).toBeFalsy()
    })
    it('argument: number', () => {
      const val = 99
      expect(isPlainObject(val)).toBeFalsy()
    })
    it('argument: boolean', () => {
      const val = true
      expect(isPlainObject(val)).toBeFalsy()
    })
    it('argument: null', () => {
      const val = null
      expect(isPlainObject(val)).toBeFalsy()
    })
    it('argument: undefined', () => {
      const val = undefined
      expect(isPlainObject(val)).toBeFalsy()
    })
    it('argument: date', () => {
      const val = new Date()
      expect(isPlainObject(val)).toBeFalsy()
    })
    it('argument: array', () => {
      const val = [1,2,3]
      expect(isPlainObject(val)).toBeFalsy()
    })
    it('argument: function', () => {
      const val = () => {}
      expect(isPlainObject(val)).toBeFalsy()
    })
    it('argument: plainObject', () => {
      const val = {}
      expect(isPlainObject(val)).toBeTruthy()
    })
  })

})





// function TEST() {
//   console.log(`string: ${isPlainObject('aaa')}`)
//   console.log(`number: ${isPlainObject(99)}`)
//   console.log(`boolean: ${isPlainObject(true)}`)
//   console.log(`null: ${isPlainObject(null)}`)
//   console.log(`undefined: ${isPlainObject(undefined)}`)
//   console.log(`array: ${isPlainObject([1,2,3])}`)
//   console.log(`function: ${isPlainObject(() => {})}`)
//   console.log(`object literal (should be false): ${isPlainObject({y: '99'}, ['x'])}`)
//   console.log(`object literal (should be false): ${isPlainObject({x: 99}), ['x']}`)
//   console.log(`object literal (should be false): ${isPlainObject({x: 99}, ['x'])}`)
//   console.log(`object literal (should be true): ${isPlainObject({})}`)
//   console.log(`object literal (should be true): ${isPlainObject({x: '99'}, ['x'])}`)
// }