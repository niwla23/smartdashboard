import create from "zustand"
import { persist } from "zustand/middleware"

interface AppSettings {
  restApiUrl: string
  setRestApiUrl: (url: string) => void
  configUrl: string
  setConfigUrl: (url: string) => void
  stylesheetUrl: string
  setStylesheetUrl: (url: string) => void
}

export const useAppSettingsStore = create<AppSettings>()(
  persist(
    (set) => ({
      restApiUrl: "",
      setRestApiUrl: (v) => set((_state) => ({ restApiUrl: v })),
      configUrl: "",
      setConfigUrl: (v) => set((_state) => ({ configUrl: v })),
      stylesheetUrl: "",
      setStylesheetUrl: (v) => set((_state) => ({ stylesheetUrl: v })),
    }),
    {
      name: "app-settings-storage",
      getStorage: () => {
        return localStorage
      },
    }
  )
)
