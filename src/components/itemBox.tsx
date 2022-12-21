import { sendCommand } from "../helpers"
import { useAppSettingsStore } from "../store"
import { ItemRegistryItem } from "../types"
import { DefaultWrapperBox } from "./defaultWrapperBox"
import DimmerBox from "./dimmerBox"

export type ItemBoxProps = {
  itemName: string
  itemRegistryData?: ItemRegistryItem
  suffix: string | null
  digits?: number
  label: string
}

export default function ItemBox(props: ItemBoxProps) {
  const appSettingsStore = useAppSettingsStore()
  if (!props.itemRegistryData || !props.itemRegistryData.type) {
    return <p>pls wait</p>
  }

  if (props.itemRegistryData.type === "Switch") {
    // Switch
    // allows user to toggle switch
    // activates box if item is ON
    const isOn = props.itemRegistryData?.state === "ON"
    const onClick = () => {
      sendCommand(appSettingsStore.restApiUrl, props.itemName, isOn ? "OFF" : "ON")
    }

    return (
      <DefaultWrapperBox
        label={props.label}
        onClick={onClick}
        isActive={isOn}
        itemName={props.itemName}
        rawState={props.itemRegistryData.state}
      >
        <span>
          {props.itemRegistryData.state}
          {props.suffix}
        </span>
      </DefaultWrapperBox>
    )
  } else if (props.itemRegistryData.type.startsWith("Number")) {
    // Number
    // changes values to have the set number of digits
    const stateNumber = Number(props.itemRegistryData.state)

    return (
      <DefaultWrapperBox label={props.label} itemName={props.itemName} rawState={props.itemRegistryData.state}>
        <span>
          {props.digits ? stateNumber.toFixed(props.digits) : stateNumber}
          {props.suffix}
        </span>
      </DefaultWrapperBox>
    )
  } else if (props.itemRegistryData.type.startsWith("Dimmer")) {
    return <DimmerBox parentProps={props} />
  } else {
    // Catch-all
    return (
      <DefaultWrapperBox label={props.label} itemName={props.itemName} rawState={props.itemRegistryData.state}>
        <span>
          {props.itemRegistryData.state}
          {props.suffix}
        </span>
      </DefaultWrapperBox>
    )
  }
}
