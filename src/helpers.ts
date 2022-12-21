export const sendCommand = async (baseUrl: string, itemName: string, command: string) => {
  return await fetch(`${baseUrl}/items/${itemName}`, { body: command, method: "POST" })
}

declare global {
  interface Element {
    requestFullScreen?(): void
    mozRequestFullScreen?(): void
    webkitRequestFullscreen?(): void
    msRequestFullscreen?(): void
  }
}

export const enableFullscreen = () => {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
}
