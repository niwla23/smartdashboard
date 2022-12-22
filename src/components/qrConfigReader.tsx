import produce, { enableMapSet } from "immer"
import React, { useEffect, useState } from "react"
import { QrReader } from "react-qr-reader"

interface TransferConfig {
  restApiUrl: string
  configUrl: string
  stylesheetUrl: string
}

type Props = {
  onResult: (config: TransferConfig) => void
}

enableMapSet()

// successfully overengineered error handling. Yes I am using a map and an immutable state manager and a plugin for it
// to handle TWO POSSIBLE ERRORS. At least it kinda works.
export default function QrConfigReader(props: Props) {
  const [cameraErrors, setCameraErrors] = useState<Set<string>>(new Set())
  useEffect(() => {
    navigator.permissions.query({ name: "camera" as PermissionName }).then((res) => {
      if (res.state !== "granted") {
        setCameraErrors(
          produce((draft) => {
            draft.add("no camera permission")
          })
        )
      }
    })

    const n = navigator as any
    n.getUserMedia(
      { audio: true, video: true },
      function (stream: any) {
        if (stream.getVideoTracks().length === 0) {
          setCameraErrors(
            produce((draft) => {
              draft.add("no camera found")
            })
          )
        }
      },
      function (_error: any) {}
    )
  }, [])

  if (cameraErrors.size > 0) {
    return <p>{Array.from(cameraErrors).join("\n")}</p>
  }

  return (
    <div>
      <QrReader
        constraints={{facingMode: "environment"}}
        className="w-full"
        videoContainerStyle={{ width: "100%", margin: "0px" }}
        onResult={(result, error) => {
          if (!!result) {
            props.onResult(JSON.parse(result?.getText()))
          }

          if (!!error) {
            console.info(error)
          }
        }}
      />
    </div>
  )
}
