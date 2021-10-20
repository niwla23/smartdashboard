import hslToRgb from '@/helpers/hsbToRgb'

describe('hslToRgB', () => {
  test('resolves pure red correctly', () => {
    expect(hslToRgb(0, 100, 100)).toStrictEqual([255, 0, 0])
  })
  test('resolves pure blue correctly', () => {
    expect(hslToRgb(240, 100, 100)).toStrictEqual([0, 0, 255])
  })
  test('resolves hardly dimmed blue correctly', () => {
    expect(hslToRgb(240, 100, 8)).toStrictEqual([0, 0, 20.400000000000002])
  })
})
