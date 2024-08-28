import { PeriodUnit } from "./types/PeriodUnit";
import { PositiveInteger, toPositiveInteger } from "./types/PositiveInteger";
import { Datum } from "./Datum";
import { Recurrency, SETUP } from "./Recurrency";

function formatted(d: Datum): string {
  return d.toString({format: 'DD.MM.YYYY HH:mm:ss.SSS Z', offset: SETUP.offset})
}

function props(rec: Recurrency): {
  id: string,
  title: string,
  lastEvent: Datum,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit
} {
  return {
    id: rec.id(),
    title: rec.title(),
    lastEvent: rec.lastEvent(),
    periodNb: rec.periodNb(),
    periodUnit: rec.periodUnit()
  }
}

const d = new Recurrency('PC-7', '2024-08-22', 94, 'days')
// expiry: 25.11.24 00:00:00.000 +02:00

describe('Testing Recurrency', () => {
  it('title()', () => {
    expect(d.title()).toBe('PC-7');
  });
  it('lastEvent()', () => {
    expect(formatted(d.lastEvent())).toBe('22.08.2024 23:59:59.999 +02:00');
  });

  it('setTitle()', () => {
    const d1 = d.setTitle('aaa')
    expect({...props(d), title: 'aaa'}).toEqual(props(d1))
  });

  it('setExpiry()', () => {
    const d1 = d.setExpiry('2024-11-25', 'period')
    expect(formatted(d.lastEvent())).toEqual('22.08.2024 23:59:59.999 +02:00')

    const d2 = d.setExpiry('2024-08-25', 'lastEvent')
    expect(d2.periodNb()).toEqual(toPositiveInteger(2))
  });

  it('setPeriodNb()', () => {
    const d1 = d.setPeriodNb(2, 'lastEvent')
    expect(formatted(d1.expiry())).toEqual('25.08.2024 00:00:00.000 +02:00')

    const d2 = d.setPeriodNb(2, 'expiry')
    expect(formatted(d2.lastEvent())).toEqual('22.11.2024 23:59:59.999 +02:00')
  });

  it('setPeriodUnit()', () => {
    const d1 = d.setPeriodNb(2, 'lastEvent').setPeriodUnit('weeks', 'lastEvent')
    expect(formatted(d1.expiry())).toEqual('06.09.2024 00:00:00.000 +02:00')

    const d2 = d.setPeriodNb(2, 'expiry').setPeriodUnit('weeks', 'expiry')
    expect(formatted(d2.lastEvent())).toEqual('10.11.2024 23:59:59.999 +02:00')
  });
});
