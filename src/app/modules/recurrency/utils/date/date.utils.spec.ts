import { add } from "../Date.utils"


describe('date', () => {
  it('test 1', () => {
    const d = new Date('2026-06-01T12:00:00Z')
    const d2 = add(d, 2, 'days')
    expect(d2.toISOString()).toBe('2026-06-03T12:00:00.000Z')
  })
})