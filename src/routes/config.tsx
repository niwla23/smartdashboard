import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import QRCode from "qrcode"
import { useAppSettingsStore } from "../store"
import { QrReader } from "react-qr-reader"
import QrConfigReader from "../components/qrConfigReader"

type InputBoxProps = {
  description: string
  value: string
  onChange: (value: string) => void
}

function InputBox(props: InputBoxProps) {
  return (
    <label className="pt-2 w-full">
      <p className="text-gray-300 bg-gray-700 w-auto inline p-1 rounded-t-md">{props.description}</p>
      <input
        className="bg-gray-700 rounded-md rounded-tl-none w-full shadow-2xl p-2"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  )
}

export default function Config() {
  const appSettingsStore = useAppSettingsStore()
  const navigate = useNavigate()

  const [restApiUrl, setRestApiUrl] = useState(appSettingsStore.restApiUrl)
  const [configUrl, setConfigUrl] = useState(appSettingsStore.configUrl)
  const [stylesheetUrl, setStylesheetUrl] = useState(appSettingsStore.stylesheetUrl)

  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [transferMode, setTransferMode] = useState<"unset" | "import" | "export">("unset")

  const exportConfig = () => {
    return JSON.stringify({ restApiUrl, configUrl, stylesheetUrl })
  }

  const generateQrCode = async () => {
    const c = await QRCode.toDataURL(exportConfig())
    setQrCodeUrl(c)
    setTransferMode("export")
  }

  const canWeLoadThis = async (url: string): Promise<[boolean, Response | null]> => {
    try {
      const resp = await fetch(url)
      return [resp.ok, resp]
    } catch {
      return [false, null]
    }
  }

  const testConfig = async (): Promise<boolean> => {
    const errors: string[] = []

    // sanity checks
    if (!restApiUrl) {
      errors.push("no API URL given")
    }
    if (!configUrl) {
      errors.push("no config URL given")
    }
    if (!stylesheetUrl) {
      errors.push("no stylesheet URL given")
    }

    // connection checks
    const [apiOk, respApi] = await canWeLoadThis(`${restApiUrl}/iconsets`)
    if (!apiOk) {
      errors.push("can't connect to openhab API")
    }

    const [configOk, respConfig] = await canWeLoadThis(configUrl)
    if (!configOk) {
      errors.push("can't load configuration file")
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const [stylesheetOk, _respStylesheet] = await canWeLoadThis(stylesheetUrl)
    if (!stylesheetOk) {
      errors.push("can't load stylesheet")
    }

    // content checks

    try {
      await respApi?.json()
    } catch {
      errors.push("could not parse openhab response as json")
    }

    try {
      await respConfig?.json()
    } catch {
      errors.push("could not parse config file as json")
    }

    if (errors.length > 0) {
      alert(errors.join("\n"))
      return false
    } else {
      alert("Configuration test passed!")
      return true
    }
  }

  const testAndSave = async () => {
    // make sure configuration is sane
    if (!(await testConfig())) {
      return
    }
    // persist config
    appSettingsStore.setRestApiUrl(restApiUrl)
    appSettingsStore.setConfigUrl(configUrl)
    appSettingsStore.setStylesheetUrl(stylesheetUrl)

    // go to dashboard
    navigate("/")
  }

  let transferSection: JSX.Element
  switch (transferMode) {
    case "import":
      transferSection = (
        <QrConfigReader
          onResult={(x) => {
            setRestApiUrl(x.restApiUrl)
            setConfigUrl(x.configUrl)
            setStylesheetUrl(x.stylesheetUrl)
            setTransferMode("unset")
          }}
        />
      )
      break

    case "export":
      transferSection = <img className="sm:max-w-[256px] rounded-md" src={qrCodeUrl} />
      break

    default:
      transferSection = <div></div>
      break
  }

  return (
    <div className="bg-gray-800 min-h-screen w-screen flex justify-center lg:pt-32 text-white">
      <main className="flex flex-col ali gap-2 w-full lg:w-2/3 xl:w-1/3 p-4">
        <h1 className="font-bold text-3xl">Configuration</h1>
        <InputBox value={restApiUrl} onChange={setRestApiUrl} description="openHAB API REST API" />
        <InputBox value={configUrl} onChange={setConfigUrl} description="Config file" />
        <InputBox value={stylesheetUrl} onChange={setStylesheetUrl} description="Stylesheet" />
        <div className="w-full flex gap-2">
          <button className="bg-gray-700 p-2 rounded-md w-full" onClick={generateQrCode}>
            Export to QR Code
          </button>
          <button
            className="bg-gray-700 p-2 rounded-md w-full"
            onClick={() => {
              setTransferMode("import")
            }}
          >
            Import from QR Code
          </button>
        </div>
        {transferSection}
        <button className="bg-green-700 p-2 rounded-md w-full" onClick={testAndSave}>
          Test & Save
        </button>
      </main>
    </div>
  )
}
