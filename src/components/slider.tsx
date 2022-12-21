import { useState } from "react"
import "./slider.css"

type Props = {
  onSubmit: (value: number) => void
  initialValue: number
}

export default function Slider(props: Props) {
  const [value, setValue] = useState(props.initialValue)

  const onPick = (e: any) => {
    props.onSubmit(Number(e.currentTarget.value))
  }
  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center p-16">
      <input
        type={"range"}
        className="w-full h-16 slider"
        min="1"
        max="100"
        onMouseUp={onPick}
        onTouchEnd={onPick}
        onChange={(e) => setValue(Number(e.target.value))}
        value={value}
      />
    </div>
  )
}
