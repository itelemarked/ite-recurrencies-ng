import { add, endOf, format } from "./date.utils"
import { toInteger } from "../../types/Integer"
import { TimezoneString, toTimezoneString } from "../../types/TimezoneString"


describe('date-utils.module.spec.ts', () => {

  describe('add()', () => {

    const d = new Date('2026-06-01T12:00:00.000Z')
    const PLUS2 = toInteger(2)
    const MINUS2 = toInteger(-2)

    it('add 2 milliseconds', () => {
      const d1 = add(d, PLUS2, 'milliseconds').toISOString()
      const result = '2026-06-01T12:00:00.002Z'
      expect(d1).toBe(result)
    })

    it('add 2 seconds', () => {
      const d1 = add(d, PLUS2, 'seconds').toISOString()
      const result = '2026-06-01T12:00:02.000Z'
      expect(d1).toBe(result)
    })

    it('add 2minutes', () => {
      const d1 = add(d, PLUS2, 'minutes').toISOString()
      const result = '2026-06-01T12:02:00.000Z'
      expect(d1).toBe(result)
    })

    it('add 2 hours', () => {
      const d1 = add(d, PLUS2, 'hours').toISOString()
      const result = '2026-06-01T14:00:00.000Z'
      expect(d1).toBe(result)
    })

    it('add 2 days', () => {
      const d1 = add(d, PLUS2, 'days').toISOString()
      const result = '2026-06-03T12:00:00.000Z'
      expect(d1).toBe(result)
    })

    it('add 2 weeks', () => {
      const d1 = add(d, PLUS2, 'weeks').toISOString()
      const result = '2026-06-15T12:00:00.000Z'
      expect(d1).toBe(result)
    })

    it('add 2 months', () => {
      const d1 = add(d, PLUS2, 'months').toISOString()
      const result = '2026-08-01T12:00:00.000Z'
      expect(d1).toBe(result)
    })

    it('add 2 years', () => {
      const d1 = add(d, PLUS2, 'years').toISOString()
      const result = '2028-06-01T12:00:00.000Z'
      expect(d1).toBe(result)
    })


    /************ -2 **************/

    it('add -2 milliseconds', () => {
      const d1 = add(d, MINUS2, 'milliseconds').toISOString()
      const result = '2026-06-01T11:59:59.998Z'
      expect(d1).toBe(result)
    })

    it('add -2 seconds', () => {
      const d1 = add(d, MINUS2, 'seconds').toISOString()
      const result = '2026-06-01T11:59:58.000Z'
      expect(d1).toBe(result)
    })

    it('add -2 minutes', () => {
      const d1 = add(d, MINUS2, 'minutes').toISOString()
      const result = '2026-06-01T11:58:00.000Z'
      expect(d1).toBe(result)
    })

    it('add -2 hours', () => {
      const d1 = add(d, MINUS2, 'hours').toISOString()
      const result = '2026-06-01T10:00:00.000Z'
      expect(d1).toBe(result)
    })

    it('add -2 days', () => {
      const d1 = add(d, MINUS2, 'days').toISOString()
      const result = '2026-05-30T12:00:00.000Z'
      expect(d1).toBe(result)
    })

    it('add -2 weeks', () => {
      const d1 = add(d, MINUS2, 'weeks').toISOString()
      const result = '2026-05-18T12:00:00.000Z'
      expect(d1).toBe(result)
    })

    it('add -2 months', () => {
      const d1 = add(d, MINUS2, 'months').toISOString()
      const result = '2026-04-01T12:00:00.000Z'
      expect(d1).toBe(result)
    })

    it('add -2 years', () => {
      const d1 = add(d, MINUS2, 'years').toISOString()
      const result = '2024-06-01T12:00:00.000Z'
      expect(d1).toBe(result)
    })

  })

  describe('endOf()', () => {

    const d = new Date('2026-06-01T12:12:12.123Z')
    const ZURICH = toTimezoneString('Europe/Zurich')
    const MAURITIUS = toTimezoneString('Indian/Mauritius')

    it('end Of milliseconds', () => {
      const d1 = endOf(d, 'milliseconds',ZURICH).toISOString()
      const result = '2026-06-01T12:12:12.123Z'
      expect(d1).toBe(result)
    })

    it('end Of seconds', () => {
      const d1 = endOf(d, 'seconds', ZURICH).toISOString()
      const result = '2026-06-01T12:12:12.999Z'
      expect(d1).toBe(result)
    })

    it('end Of minutes', () => {
      const d1 = endOf(d, 'minutes', ZURICH).toISOString()
      const result = '2026-06-01T12:12:59.999Z'
      expect(d1).toBe(result)
    })

    it('end Of hours', () => {
      const d1 = endOf(d, 'hours', ZURICH).toISOString()
      const result = '2026-06-01T12:59:59.999Z'
      expect(d1).toBe(result)
    })

    it('end Of days', () => {
      const d1 = endOf(d, 'days', ZURICH).toISOString()
      const result = '2026-06-01T21:59:59.999Z'
      expect(d1).toBe(result)
    })

    it('end Of weeks', () => {
      const d1 = endOf(d, 'weeks', ZURICH).toISOString()
      const result = '2026-06-07T21:59:59.999Z'
      expect(d1).toBe(result)
    })

    it('end Of months', () => {
      const d1 = endOf(d, 'months', ZURICH).toISOString()
      const result = '2026-06-30T21:59:59.999Z'
      expect(d1).toBe(result)
    })

    it('end Of years', () => {
      const d1 = endOf(d, 'years', ZURICH).toISOString()
      const result = '2026-12-31T22:59:59.999Z'
      expect(d1).toBe(result)
    })

  })

  describe('format()', () => {

    const DATE1 = new Date('2026-06-01T12:12:12.123Z')
    const DATE2 = new Date('2026-06-01T12:12Z')
    const ZURICH = toTimezoneString('Europe/Zurich')
    const MAURITIUS = toTimezoneString('Indian/Mauritius')

    it('format long zurich, input precise to milliseconds', () => {
      const s1 = format(DATE1, 'DD.MM.YY HH:mm:ss.SSS TIMEZONE', ZURICH)
      const result = '01.06.26 14:12:12.123 Europe/Zurich'
      expect(s1).toBe(result)
    })

    it('format long zurich, input precise to minutes', () => {
      const s1 = format(DATE2, 'DD.MM.YY HH:mm:ss.SSS TIMEZONE', ZURICH)
      const result = '01.06.26 14:12:00.000 Europe/Zurich'
      expect(s1).toBe(result)
    })

    it('format short zurich, input precise to milliseconds', () => {
      const s1 = format(DATE2, 'DD.MM.YYYY', ZURICH)
      const result = '01.06.2026'
      expect(s1).toBe(result)
    })
  })

})

