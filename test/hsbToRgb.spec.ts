import hslToRgb from '@/helpers/hsbToRgb'

describe('hslToRgB', () => {
  test('resolves pure red correctly', () => {
    let rgb = hslToRgb(0, 100, 100)
    console.log(rgb)
    expect(rgb).toEqual([255, 0, 0])
  })
  test('resolves pure blue correctly', () => {
    expect(hslToRgb(240, 100, 100)).toEqual([0, 0, 255])
  })
  test('resolves hardly dimmed blue correctly', () => {
    expect(hslToRgb(240, 100, 8)).toEqual([0, 0, 20.400000000000002])
  })
})
