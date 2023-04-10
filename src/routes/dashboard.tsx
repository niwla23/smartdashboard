import { useEffect, useState } from "react"
import { produce } from "immer"
import { useAppSettingsStore } from "../store"
import { DashboardConfig, ItemRegistryItem } from "../types"
import ItemBox from "../components/itemBox"
import { enableFullscreen } from "../helpers"

export default function Dashboard() {
  const appSettingsStore = useAppSettingsStore()
  const [config, setConfig] = useState<DashboardConfig>({ pages: [], ping_url: "" })
  const [itemRegistry, setItemRegistry] = useState<{ [itemName: string]: ItemRegistryItem }>({})
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const loadConfig = async (): Promise<DashboardConfig> => {
    const r = await fetch(appSettingsStore.configUrl)
    const data: DashboardConfig = await r.json()
    setConfig(data)
    return data
  }

  const loadItemState = async (itemName: string) => {
    const response = await fetch(`${appSettingsStore.restApiUrl}/items/${itemName}`)
    const data = await response.json()
    setItemRegistry(
      produce((draft) => {
        const itemData: ItemRegistryItem = { state: data.state, type: data.type, statePattern: "%d" }

        if (data.stateDescription) {
          itemData.statePattern = data.stateDescription.pattern
        }

        if (itemData.statePattern.includes("%unit%")) {
          const parts = itemData.state.split(" ")
          itemData.unit = parts[parts.length - 1]
          itemData.state = parts.slice(0, -1).join(" ")
        }

        draft[itemName] = itemData
      })
    )
  }

  const loadAllItems = (config2: DashboardConfig) => {
    for (const page of config2.pages) {
      for (const item of page.items) {
        loadItemState(item.item_name)
      }
    }
  }

  const handleSseEvent = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    const payload = JSON.parse(data.payload)
    if (data.type === "ItemStateEvent") {
      const itemName = data.topic.split("/")[2]
      setItemRegistry(
        produce((draft) => {
          draft[itemName] = { ...draft[itemName], state: payload.value }
        })
      )
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timer
    loadConfig().then((c) => {
      loadAllItems(c)
      if (c.ping_url) {
        let url = c.ping_url
        intervalId = setInterval(() => {
          fetch(url)
        }, 10000)
      }
    })

    let evtSource = new EventSource(`${appSettingsStore.restApiUrl}/events`)
    var evtSourceErrorHandler = function (event: any) {
      var txt
      switch (event.target.readyState) {
        case EventSource.CONNECTING:
          txt = "Reconnecting..."
          break
        case EventSource.CLOSED:
          txt = "Reinitializing..."
          evtSource = new EventSource("../sse.php")
          evtSource.onerror = evtSourceErrorHandler
          break
      }
      console.log(txt)
    }
    evtSource.onerror = evtSourceErrorHandler
    evtSource.onmessage = handleSseEvent

    return () => {
      evtSource.close()
      clearInterval(intervalId)
    }
  }, [])

  if (config.pages.length === 0) {
    return <div>no pages found</div>
  }

  const currentPage = config.pages[currentPageIndex]

  const renderedItems: JSX.Element[] = []
  currentPage.items.forEach((item) => {
    renderedItems.push(
      <ItemBox
        itemName={item.item_name}
        label={item.label}
        suffix={item.suffix}
        digits={item.digits!}
        itemRegistryData={itemRegistry[item.item_name]}
        key={item.item_name}
      />
    )
  })

  const renderedPageIcons: JSX.Element[] = []
  for (const [i, page] of config.pages.entries()) {
    const isActivePage = currentPageIndex === i
    let className = "smartdashboard-page-button w-full transition-all duration-500 ease-out"
    if (isActivePage) {
      className = `${className} smartdashboard-page-button-active`
    }
    renderedPageIcons.push(
      <button key={page.name} className={className} onClick={() => setCurrentPageIndex(i)}>
        <img className="fill-white" src={page.icon} />
      </button>
    )
  }

  return (
    <div className="select-none">
      <link rel="stylesheet" href={appSettingsStore.stylesheetUrl} />
      <div className="w-full h-screen p-2 flex smartdashboard-bg" data-page-name={currentPage.name}>
        <aside className="h-full flex flex-col justify-between min-w-[4rem] gap-4">
          {/* page icons */}
          <div className="flex flex-col gap-2">{renderedPageIcons}</div>
          {/* fullscreen button */}
          <button className="smartdashboard-page-button w-full" onClick={enableFullscreen}>
            <img src="/icons/fullscreen.svg" />
          </button>
        </aside>
        <main
          className="grid h-full auto-rows-fr gap-6 bg-cover flex-grow smartdashboard-grid transition-all"
          style={{ gridTemplateColumns: `repeat(${currentPage.columns}, minmax(0,1fr))` }}
        >
          {renderedItems}
        </main>
      </div>
    </div>
  )
}
