export const state = () => ({
  currentItem: "",
  currentItemState: "",
  sliderOverlayShown: false,
  colorpickerOverlayShown: false
})

export const mutations = {
  setItem(state, item: string) {
    state.currentItem = item
  },
  setItemState(state, itemState: string) {
    state.currentItemState = itemState
  },
  setSliderOverlayShown(state, value: boolean) {
    state.sliderOverlayShown = value
  },
  setColorpickerOverlayShown(state, value: boolean) {
    state.colorpickerOverlayShown = value
  }
}
