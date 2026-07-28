import { isArray, isBoolean, isFunction, isInterface, isNull, isNumber, isOptional, isPlainObject, isString, isUndefined } from "./valid-type"

const AllTypes = {
  aNull: null,
  aUndefined: undefined,
  aString: 'aaa',
  aNumber: 99,
  aBoolean: true,
  anEmptyObj: {},
  anObj: {x: 1},
  anEmptyArr: ['x'],
  anArr: ['x'],
  aFn: () => {},
}

function itCheck(prop: keyof typeof AllTypes, isFn: (val: any) => boolean, is: boolean) {
  return it(`checks '${prop}'`, () => {
    expect(isFn(AllTypes[prop])).toBe(is)
  })
}

describe('isNull', () => {
  itCheck('aNull', isNull, true)
  itCheck('aUndefined', isNull, false)
  itCheck('aString', isNull, false)
  itCheck('aNumber', isNull, false)
  itCheck('aBoolean', isNull, false)
  itCheck('anEmptyObj', isNull, false)
  itCheck('anObj', isNull, false)
  itCheck('anEmptyArr', isNull, false)
  itCheck('anArr', isNull, false)
  itCheck('aFn', isNull, false)
})
describe('isUndefined', () => {
  itCheck('aNull', isUndefined, false)
  itCheck('aUndefined', isUndefined, true)
  itCheck('aString', isUndefined, false)
  itCheck('aNumber', isUndefined, false)
  itCheck('aBoolean', isUndefined, false)
  itCheck('anEmptyObj', isUndefined, false)
  itCheck('anObj', isUndefined, false)
  itCheck('anEmptyArr', isUndefined, false)
  itCheck('anArr', isUndefined, false)
  itCheck('aFn', isUndefined, false)
})
describe('isString', () => {
  itCheck('aNull', isString, false)
  itCheck('aUndefined', isString, false)
  itCheck('aString', isString, true)
  itCheck('aNumber', isString, false)
  itCheck('aBoolean', isString, false)
  itCheck('anEmptyObj', isString, false)
  itCheck('anObj', isString, false)
  itCheck('anEmptyArr', isString, false)
  itCheck('anArr', isString, false)
  itCheck('aFn', isString, false)
})
describe('isNumber', () => {
  itCheck('aNull', isNumber, false)
  itCheck('aUndefined', isNumber, false)
  itCheck('aString', isNumber, false)
  itCheck('aNumber', isNumber, true)
  itCheck('aBoolean', isNumber, false)
  itCheck('anEmptyObj', isNumber, false)
  itCheck('anObj', isNumber, false)
  itCheck('anEmptyArr', isNumber, false)
  itCheck('anArr', isNumber, false)
  itCheck('aFn', isNumber, false)
})
describe('isBoolean', () => {
  itCheck('aNull', isBoolean, false)
  itCheck('aUndefined', isBoolean, false)
  itCheck('aString', isBoolean, false)
  itCheck('aNumber', isBoolean, false)
  itCheck('aBoolean', isBoolean, true)
  itCheck('anEmptyObj', isBoolean, false)
  itCheck('anObj', isBoolean, false)
  itCheck('anEmptyArr', isBoolean, false)
  itCheck('anArr', isBoolean, false)
  itCheck('aFn', isBoolean, false)
})
describe('isPlainObject', () => {
  itCheck('aNull', isPlainObject, false)
  itCheck('aUndefined', isPlainObject, false)
  itCheck('aString', isPlainObject, false)
  itCheck('aNumber', isPlainObject, false)
  itCheck('aBoolean', isPlainObject, false)
  itCheck('anEmptyObj', isPlainObject, true)
  itCheck('anObj', isPlainObject, true)
  itCheck('anEmptyArr', isPlainObject, false)
  itCheck('anArr', isPlainObject, false)
  itCheck('aFn', isPlainObject, false)
})
describe('isArray', () => {
  itCheck('aNull', isArray, false)
  itCheck('aUndefined', isArray, false)
  itCheck('aString', isArray, false)
  itCheck('aNumber', isArray, false)
  itCheck('aBoolean', isArray, false)
  itCheck('anEmptyObj', isArray, false)
  itCheck('anObj', isArray, false)
  itCheck('anEmptyArr', isArray, true)
  itCheck('anArr', isArray, true)
  itCheck('aFn', isArray, false)
})
describe('isFunction', () => {
  itCheck('aNull', isFunction, false)
  itCheck('aUndefined', isFunction, false)
  itCheck('aString', isFunction, false)
  itCheck('aNumber', isFunction, false)
  itCheck('aBoolean', isFunction, false)
  itCheck('anEmptyObj', isFunction, false)
  itCheck('anObj', isFunction, false)
  itCheck('anEmptyArr', isFunction, false)
  itCheck('anArr', isFunction, false)
  itCheck('aFn', isFunction, true)
})

describe('isInterface()', () => {
  type Graph = {
    xLabel: string, 
    yLabel: string, 
    origin: {
      x: number, 
      y: number
    },
    optionalProp?: string,
    optionalPropWhichMayBeUndefined?: string | undefined,
    nonOptionalPropWhichMayBeUndefined: string | undefined
  }

  const isGraph = isInterface<Graph>({
     xLabel: [isString],
     yLabel: [isString],
     origin: [
       isInterface({
         x: [isNumber],
         y: [isNumber]
       })
     ],
     nonOptionalPropWhichMayBeUndefined: [isString, isUndefined],
     optionalProp: [isOptional, isString],
     optionalPropWhichMayBeUndefined: [isOptional, isString, isUndefined],
  })

  it('all non-optional properties fullfills requirements', () => {
    const graph = {
      xLabel: 'time',
      yLabel: 'distance',
      origin: {
        x: 10,
        y: 10
      },
      nonOptionalPropWhichMayBeUndefined: undefined
    }
    expect(isGraph(graph)).toBe(true)
  })

  it('all non-optional properties should be defined (missing "nonOptionalPropWhichMayBeUndefined")', () => {
    const invalidGraph = {
      xLabel: 'time',
      yLabel: 'distance',
      origin: {
        x: 10,
        y: 10
      }
    }
    expect(isGraph(invalidGraph)).toBe(false)
  })

  it('optional property should have the right type', () => {
    const invalidGraph = {
      xLabel: 'time',
      yLabel: 'distance',
      origin: {
        x: 10,
        y: 10
      },
      optionalProp: 99,
      nonOptionalPropWhichMayBeUndefined: undefined
    }
    expect(isGraph(invalidGraph)).toBe(false)
  })

  it('additionnal property should be accepted', () => {
    const graph = {
      xLabel: 'time',
      yLabel: 'distance',
      origin: {
        x: 10,
        y: 10
      },
      nonOptionalPropWhichMayBeUndefined: undefined,
      anyOtherProperty: 'anyOther'
    }
    expect(isGraph(graph)).toBe(true)
  })
})