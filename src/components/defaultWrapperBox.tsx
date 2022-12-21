import React from "react"

type DefaultWrapperProps = {
  label: string
  children?: JSX.Element[] | JSX.Element
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  isActive?: boolean
  itemName: string
  rawState: string
}

export function DefaultWrapperBox(props: DefaultWrapperProps) {
  let figureClassName = "grid place-items-center text-center p-2 smartdashboard-box transition duration-500 ease-out"
  if (props.isActive) {
    figureClassName = `${figureClassName} smartdashboard-box-active`
  }
  return (
    <figure
      className={figureClassName}
      onClick={props.onClick}
      data-item-name={props.itemName}
      data-item-state={props.rawState}
    >
      <div>
        <figcaption className="text-2xl md:text-4xl xl:text-5xl smartdashboard-item-label">{props.label}</figcaption>
        <div className="text-4xl md:text-6xl xl:text-8xl font-bold smartdashboard-item-state">{props.children}</div>
      </div>
    </figure>
  )
}
