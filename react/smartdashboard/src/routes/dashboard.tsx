import { useEffect, useState } from "react"
import produce from "immer"
import { useAppSettingsStore } from "../store"
import { DashboardConfig, Page, Item } from "../types"
import ItemBox from "../components/itemBox"

export default function Dashboard() {
  const appSettingsStore = useAppSettingsStore()
  const [config, setConfig] = useState<DashboardConfig>({ pages: [] })
  const [itemRegistry, setItemRegistry] = useState<{ [itemName: string]: string }>({})
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const loadConfig = async () => {
    const r = await fetch(appSettingsStore.configUrl)
    const data: DashboardConfig = await r.json()
    setConfig(data)
  }

  const handleSseEvent = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    const payload = JSON.parse(data.payload)
    if (data.type === "ItemStateEvent") {
      const itemName = data.topic.split("/")[2]
      const localRegistry = { ...itemRegistry }
      localRegistry[itemName] = payload.value
      setItemRegistry(
        produce((draft) => {
          draft[itemName] = payload.value
        })
      )
    }
  }

  useEffect(() => {
    loadConfig()
    const evtSource = new EventSource("https://openhab.b49.cloudserver.click/rest/events")
    evtSource.onmessage = handleSseEvent

    return () => {
      evtSource.close()
    }
  }, [])

  if (config.pages.length === 0) {
    return <div>no pages found</div>
  }

  const currentPage = config.pages[currentPageIndex]
  const renderedItems: JSX.Element[] = []
  currentPage.items.forEach((item) => {
    renderedItems.push(<ItemBox itemName={item.item_name} suffix={item.suffix} state={itemRegistry[item.item_name]} />)
  })

  return (
    <div
      className="w-full h-screen p-2 grid auto-rows-fr gap-6 bg-cover flex-grow smartdashboard-grid"
      style={{ gridTemplateColumns: `repeat(${currentPage.columns}, minmax(0,1fr))` }}
    >
      {renderedItems}
    </div>
  )
}
