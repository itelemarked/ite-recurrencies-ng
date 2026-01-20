import { deepCopy, get } from "./object"

describe('deepCopy()', () => {
  it('a copied PlainObject should have the same properties', () => {
    const obj = {
      x: 99,
      y: 88
    }
    expect(deepCopy(obj)).toEqual({x: 99, y: 88})
  })
  it('a copied PlainObject shouldn\'t have the same reference', () => {
    const obj = {
      x: 99,
      y: 88
    }
    expect(deepCopy(obj)).not.toBe(obj)
  })
  it('a copied Array should have the same values', () => {
    const arr = [88, 99]
    expect(deepCopy(arr)).toEqual([88, 99])
    
  })
  it('a copied Array shouldn\'t have the same reference', () => {
    const arr = [88, 99]
    expect(deepCopy(arr)).not.toBe(arr)
  })
})

describe('get()', () => {

  const obj = {
    xAxis: {
      points: {
        x: 99,
        y: 88
      }
    }
  }

  it('should get the points object', () => {
    expect(get(obj, 'xAxis/points')).toEqual({x: 99, y: 88})
  })
  it('the point object shouldn\'t be the same reference', () => {
    expect(get(obj, 'xAxis/points')).not.toBe(obj.xAxis.points)
  })
  it('a path which doesn\'t match should return null', () => {
    expect(get(obj, 'xAxis/pois')).toBe(null)
  })
  it('an empty path should return null', () => {
    expect(get(obj, '')).toBe(null)
  })
  it('an undefined path should return a copy of the object...', () => {
    expect(get(obj)).toEqual(obj)
  })
  it('...which is not the same reference', () => {
    expect(get(obj)).not.toBe(obj)
  })
})
