import {TimezoneDate2} from './TimezoneDate2'
import { DATE_FORMAT, DateFormat } from './types/DateFormat'
import { DateString } from './types/DateString'
import { PositiveInteger } from './types/PositiveInteger'
import { TimeString } from './types/TimeString'
import { Timezone } from './types/Timezone'
import { TimezoneDateInterface } from './types/TimezoneDateInterface'

describe('TimezoneDate2()', () => {
  let date: Date
  let dateString: DateString
  let timeString: TimeString
  let timezone: Timezone
  let dateFormat: DateFormat
  let tzByDate: TimezoneDateInterface
  let tz: TimezoneDateInterface

  beforeEach(() => {
    date = new Date('2026-03-12T12:00:00.000Z')
    dateString = '2026-03-12' as DateString
    timeString = '16:00' as TimeString
    timezone = 'Indian/Mauritius'
    dateFormat = 'ISO'
    tzByDate = TimezoneDate2.createByDate(date, timezone, dateFormat)
    tz = TimezoneDate2.create(dateString, timeString, timezone, dateFormat)
  })

  it('create(): creates a TimezoneDate with correct state', () => {
    expect(tz.date().toISOString()).toBe('2026-03-12T12:00:00.000Z')
    expect(tz.timezone()).toBe('Indian/Mauritius')
    expect(tz.dateFormat()).toBe('ISO')
    // additionnaly, check dateString() and timeString()
    expect(tz.dateString()).toBe('2026-03-12')
    expect(tz.timeString()).toBe('16:00:00.000')
  })

  it('createByDate() creates a TimezoneDate by date, with correct state, and throw when invalid date is passed', () => {
    expect(tz.date().toISOString()).toBe('2026-03-12T12:00:00.000Z')
    expect(tz.timezone()).toBe('Indian/Mauritius')
    expect(tz.dateFormat()).toBe('ISO')
    // additionnaly, check dateString() and timeString()
    expect(tz.dateString()).toBe('2026-03-12')
    expect(tz.timeString()).toBe('16:00:00.000')

    const invalidDateArgument = '2026-02-41T08:00Z'
    expect(() => TimezoneDate2.createByDate(
      new Date(invalidDateArgument),
      timezone,
      dateFormat
    )).toThrow()

    // NB: create() will never produce a Invalid Date, since DateString and TimeString are asserted to be the right formats!
  })

  it('diff(): should returns the number of days', () => {
    const date1 = new Date('2026-03-10T00:00:00.000Z') // 2.5 days before tz
    const tz1 = TimezoneDate2.createByDate(date1, timezone, dateFormat)
    
    expect(tz.diff('days', {timezoneDate: tz1})).toEqual(2)
    expect(tz.diff('days', {timezoneDate: tz1, floored: false})).toEqual(2.5)
  })

  it('diff(): should returns the number of days to "now", if second parameter is ommitted', () => {
    const dateNow = new Date()

    // set date1 2.5 days after now
    let date1 = new Date(dateNow.valueOf())
    date1.setDate(date1.getDate() + 2)
    date1.setHours(date1.getHours() + 12)

    const tz1 = TimezoneDate2.createByDate(date1, timezone, dateFormat)
    
    expect(tz1.diff('days')).toEqual(2)
    expect(tz1.diff('days', {floored: false})).toEqual(2.5)
  })

  it('toString()', () => { 
    expect(tz.toString()).toEqual('2026-03-12T16:00:00.000+04:00')
    // expect(tz.toString({dateFormat: DATE_FORMAT.PLATFORM_DEFINED})).toEqual('3/12/2026')
    expect(tz.toString({dateFormat: DATE_FORMAT.CH_DATE})).toEqual('12.03.2026')
    expect(tz.toString({dateFormat: DATE_FORMAT.CH_DATE_TIME})).toEqual('12.03.2026 16:00')
    expect(tz.toString({dateFormat: DATE_FORMAT.CH_DATE_TIME, timezone: 'Europe/Zurich'})).toEqual('12.03.2026 13:00')
    expect(tz.toString({dateFormat: DATE_FORMAT.US_DATE})).toEqual('03/12/26')
    expect(tz.toString({dateFormat: DATE_FORMAT.ISO})).toEqual('2026-03-12T16:00:00.000+04:00')
    expect(tz.toString({dateFormat: DATE_FORMAT.DATE_STRING})).toEqual('2026-03-12')
  })

  it('update()', () => {
    const tz_10March = tz.update({dateString: '2026-03-10' as DateString})
    const tz_0900LT = tz.update({timeString: '09:00' as TimeString})
    const tz_Zurich = tz.update({timezone: 'Europe/Zurich'})
    const tz_CHDateTime = tz.update({dateFormat: DATE_FORMAT.CH_DATE_TIME})
    const tz_10March_0900LT_Zurich = tz.update({
      dateString: '2026-03-10' as DateString,
      timeString: '09:00' as TimeString,
      timezone: 'Europe/Zurich'
    })

    expect(tz_10March.toString()).toBe('2026-03-10T16:00:00.000+04:00')
    expect(tz_0900LT.toString()).toBe('2026-03-12T09:00:00.000+04:00')
    expect(tz_Zurich.toString()).toBe('2026-03-12T16:00:00.000+01:00')
    expect(tz_CHDateTime.toString()).toBe('12.03.2026 16:00')
    expect(tz_10March_0900LT_Zurich.toString()).toBe('2026-03-10T09:00:00.000+01:00')
  })

  it('add()', () => {
    const nb = 2 as PositiveInteger

    // CHECKS ALL UNITS
    expect(tz.add(nb, 'milliseconds').toString()).toBe('2026-03-12T16:00:00.002+04:00')
    expect(tz.add(nb, 'seconds').toString()).toBe('2026-03-12T16:00:02.000+04:00')
    expect(tz.add(nb, 'minutes').toString()).toBe('2026-03-12T16:02:00.000+04:00')
    expect(tz.add(nb, 'hours').toString()).toBe('2026-03-12T18:00:00.000+04:00')
    expect(tz.add(nb, 'days').toString()).toBe('2026-03-14T16:00:00.000+04:00')
    expect(tz.add(nb, 'weeks').toString()).toBe('2026-03-26T16:00:00.000+04:00')
    expect(tz.add(nb, 'months').toString()).toBe('2026-05-12T16:00:00.000+04:00')
    expect(tz.add(nb, 'years').toString()).toBe('2028-03-12T16:00:00.000+04:00')
    
    // CHECKS OPTION PARAMETERS
    expect(tz.add(nb, 'days', {timezone: 'Europe/Zurich'}).toString()).toBe('2026-03-14T13:00:00.000+01:00')
    expect(tz.add(nb, 'days', {dateFormat: DATE_FORMAT.CH_DATE_TIME}).toString()).toBe('14.03.2026 16:00')
    expect(tz.add(nb, 'days', {timezone: 'Europe/Zurich', dateFormat: DATE_FORMAT.CH_DATE_TIME}).toString()).toBe('14.03.2026 13:00')

    // CHECKS APPLY CORRECT DST
    expect(tz.add(nb, 'months', {timezone: 'Europe/Zurich'}).toString()).toBe('2026-05-12T14:00:00.000+02:00')
  })

  it('subtract()', () => {
    const nb = 2 as PositiveInteger

    // CHECKS ALL UNITS
    expect(tz.subtract(nb, 'milliseconds').toString()).toBe('2026-03-12T15:59:59.998+04:00')
    expect(tz.subtract(nb, 'seconds').toString()).toBe('2026-03-12T15:59:58.000+04:00')
    expect(tz.subtract(nb, 'minutes').toString()).toBe('2026-03-12T15:58:00.000+04:00')
    expect(tz.subtract(nb, 'hours').toString()).toBe('2026-03-12T14:00:00.000+04:00')
    expect(tz.subtract(nb, 'days').toString()).toBe('2026-03-10T16:00:00.000+04:00')
    expect(tz.subtract(nb, 'weeks').toString()).toBe('2026-02-26T16:00:00.000+04:00')
    expect(tz.subtract(nb, 'months').toString()).toBe('2026-01-12T16:00:00.000+04:00')
    expect(tz.subtract(nb, 'years').toString()).toBe('2024-03-12T16:00:00.000+04:00')
    
    // CHECKS OPTION PARAMETERS
    expect(tz.subtract(nb, 'days', {timezone: 'Europe/Zurich'}).toString()).toBe('2026-03-10T13:00:00.000+01:00')
    expect(tz.subtract(nb, 'days', {dateFormat: DATE_FORMAT.CH_DATE_TIME}).toString()).toBe('10.03.2026 16:00')
    expect(tz.subtract(nb, 'days', {timezone: 'Europe/Zurich', dateFormat: DATE_FORMAT.CH_DATE_TIME}).toString()).toBe('10.03.2026 13:00')

    // // CHECKS APPLY CORRECT DST
    expect(tz.subtract(8 as PositiveInteger, 'months', {timezone: 'Europe/Zurich'}).toString()).toBe('2025-07-12T14:00:00.000+02:00')
  })

  it('endOf()', () => {
    const tz_Minus = tz
      .subtract(20 as PositiveInteger, 'milliseconds')
      .subtract(20 as PositiveInteger, 'seconds')
      .subtract(20 as PositiveInteger, 'minutes')

    // CHECKS ALL UNITS
    expect(tz_Minus.endOf('milliseconds').toString()).toBe('2026-03-12T15:39:39.980+04:00')
    expect(tz_Minus.endOf('seconds').toString()).toBe('2026-03-12T15:39:39.999+04:00')
    expect(tz_Minus.endOf('minutes').toString()).toBe('2026-03-12T15:39:59.999+04:00')
    expect(tz_Minus.endOf('hours').toString()).toBe('2026-03-12T15:59:59.999+04:00')
    expect(tz_Minus.endOf('days').toString()).toBe('2026-03-12T23:59:59.999+04:00')
    expect(tz_Minus.endOf('weeks').toString()).toBe('2026-03-15T23:59:59.999+04:00')
    expect(tz_Minus.endOf('months').toString()).toBe('2026-03-31T23:59:59.999+04:00')
    expect(tz_Minus.endOf('years').toString()).toBe('2026-12-31T23:59:59.999+04:00')
  })

})

