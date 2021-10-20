export const state = () => ({
  currentItem: "",
  currentItemState: "",
  sliderOverlayShown: false
})

export const mutations = {
  setItem(state, item: string) {
    state.currentItem = item
  },
  setItemState(state, itemState: string) {
    state.currentItemState = itemState
  },
  setSliderOverlayShow(state, value: boolean) {
    state.sliderOverlayShown = value
  }
}
