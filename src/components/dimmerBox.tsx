import React, { useState } from "react"
import { sendCommand } from "../helpers"
import { useAppSettingsStore } from "../store"
import { DefaultWrapperBox } from "./defaultWrapperBox"
import { ItemBoxProps } from "./itemBox"
import Slider from "./slider"

type Props = {
  parentProps: ItemBoxProps
}

export default function DimmerBox({ parentProps: props }: Props) {
  if (!props.itemRegistryData) {
    return <p>nope</p>
  }
  const appSettingsStore = useAppSettingsStore()
  const stateNumber = Number(props.itemRegistryData.state)
  const [sliderOpen, setSliderOpen] = useState(false)

  return (
    <DefaultWrapperBox
      label={props.label}
      onClick={() => setSliderOpen(!sliderOpen)}
      itemName={props.itemName}
      rawState={props.itemRegistryData.state}
    >
      <div>
        {sliderOpen && (
          <Slider
            initialValue={Number(props.itemRegistryData.state)}
            onSubmit={(v) => {
              sendCommand(appSettingsStore.restApiUrl, props.itemName, v.toString())
              setSliderOpen(false)
            }}
          />
        )}
      </div>

      <span>
        {props.digits ? stateNumber.toFixed(props.digits) : stateNumber}
        {props.suffix}
      </span>
    </DefaultWrapperBox>
  )
}
