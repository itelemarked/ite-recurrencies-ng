import { isArray, isBoolean, isFunction, isInterface, isNull, isNumber, isOptional, isPlainObject, isString, isUndefined } from "./validation";

describe('validation.ts', () => {

  const ALL_TYPES = {
    'undefined': undefined,
    'null': null,
    'string': 'abcd',
    'number': 1234,
    'boolean': true,
    'array': [1,2,3,4],
    'plain-object': {x: 1, y: 2, z: 3},
    'function': () => {}
  }

  function mapAllTypes(fn: (val: any) => boolean): boolean[] {
    return Object.values(ALL_TYPES).map(val => fn(val))
  }

  it(`isUndefined()`, () => {
    expect(mapAllTypes(isUndefined)).toEqual([true, false, false, false, false, false, false, false]);
  });

  it(`isNull()`, () => {
    expect(mapAllTypes(isNull)).toEqual([false, true, false, false, false, false, false, false]);
  });

  it(`isString()`, () => {
    expect(mapAllTypes(isString)).toEqual([false, false, true, false, false, false, false, false]);
  });

  it(`isNumber()`, () => {
    expect(mapAllTypes(isNumber)).toEqual([false, false, false, true, false, false, false, false]);
  });

  it(`isBoolean()`, () => {
    expect(mapAllTypes(isBoolean)).toEqual([false, false, false, false, true, false, false, false]);
  });

  it(`isArray()`, () => {
    expect(mapAllTypes(isArray)).toEqual([false, false, false, false, false, true, false, false]);
  });

  it(`isPlainObject()`, () => {
    expect(mapAllTypes(isPlainObject)).toEqual([false, false, false, false, false, false, true, false]);
  });

  it(`isFunction()`, () => {
    expect(mapAllTypes(isFunction)).toEqual([false, false, false, false, false, false, false, true]);
  });

  describe(`isInterface()`, () => {
    type Point1 = {
      x: number,
      y: number,
      z: number
    }
    type Point2 = {
      x?: number,
      y: number,
      z: number
    }
    type Point3 = {
      x: number | undefined,
      y: number,
      z: number
    }
    const interface1 = {
      x: [isNumber],
      y: [isNumber],
      z: [isNumber]
    }
    const interface2 = {
      x: [isNumber, isOptional],
      y: [isNumber],
      z: [isNumber]
    }
    const interface3 = {
      x: [isNumber, isUndefined],
      y: [isNumber],
      z: [isNumber]
    }

    const interface5 = {
      x: [
        isInterface({
          mgrs: [isString], 
          latlong: [isString]
        })
      ],
      y: [
        isNumber
      ]
    }

    const interfaceGraph1 = {
      xLabel: [isString],
      yLabel: [isString],
      origin: [
        isInterface({
          x: [isNumber],
          y: [isNumber]
        })
      ],
      description: [isString, isOptional]
    }

    const interfaceGraph2 = {
      xLabel: [isString],
      yLabel: [isString],
      origin: [
        isInterface({
          x: [isNumber],
          y: [isNumber]
        }),
        isOptional
      ],
      description: [isString, isOptional]
    }

    const graph1 = {
      xLabel: 'time',
      yLabel: 'distance',
      origin: {
        x: 10,
        y: 10
      }
    }

    const graph2 = {
      xLabel: 'time',
      yLabel: 'distance',
    }
    
    const val1 = {
      x: 1,
      y: 2,
      z: 3
    }
    const val2 = {
      y: 2,
      z: 3
    }
    const val3a = {
      x: 1,
      y: 2,
      z: 3
    }
    const val3b = {
      x: undefined,
      y: 2,
      z: 3
    }
    const val4 = {
      x: 'aaa',
      y: 2,
      z: 3
    }
    const val5 = {
      x: {
        mgrs: 'mgrs',
        latlong: 'latlong'
      },
      y: 2
    }

    it('first', () => {
      expect( isInterface(interface1)(val1)).toEqual(true);
    })
    it('second', () => {
      expect( isInterface(interface2)(val2)).toEqual(true);
    })
    it('third-a', () => {
      expect( isInterface(interface3)(val3a)).toEqual(true);
    })
    it('third-b', () => {
      expect( isInterface(interface3)(val3b)).toEqual(true);
    })
    it('fourth-a', () => {
      expect( isInterface(interface1)(val4)).toEqual(false);
    })
    it('fourth-b', () => {
      expect( isInterface(interface2)(val4)).toEqual(false);
    })
    it('fourth-c', () => {
      expect( isInterface(interface3)(val4)).toEqual(false);
    })
    it('fifth', () => {
      expect( isInterface(interface5)(val5)).toEqual(true);
    })
    it('graph-1 example', () => {
      expect( isInterface(interfaceGraph1)(graph1)).toEqual(true);
    })
    it('graph-2 example', () => {
      expect( isInterface(interfaceGraph2)(graph2)).toEqual(true);
    })
  });

  

})