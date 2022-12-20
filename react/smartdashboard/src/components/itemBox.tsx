type Props = {
  itemName: string
  state: string
  suffix: string | null
}

export default function ItemBox(props: Props) {
  return (
    <figure>
      <figcaption>{props.itemName}</figcaption>
      <p>
        {props.state} {props.suffix}
      </p>
    </figure>
  )
}
