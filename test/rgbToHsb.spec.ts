import RgbToHsb from '@/helpers/rgbToHsb'

describe('RgbToHsb', () => {
  test('resolves pure red correctly', () => {
    expect(RgbToHsb(255, 0, 0)).toStrictEqual([0, 100, 100])
  })
  test('resolves pure blue correctly', () => {
    expect(RgbToHsb(0, 0, 255)).toStrictEqual([240, 100, 100])
  })
  test('resolves hardly dimmed blue correctly', () => {
    expect(RgbToHsb(0, 0, 20.400000000000002)).toStrictEqual([240, 100, 8])
  })
})
