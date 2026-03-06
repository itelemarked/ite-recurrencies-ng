import { isInterface, isNumber, isOptional, isString, isUndefined } from "./valid-type"

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