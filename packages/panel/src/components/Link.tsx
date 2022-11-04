import { FunctionComponent } from "preact"

interface Props {
  to: string
  classes?: string
  external?: boolean
}

const Link: FunctionComponent<Props> = ({ to, external, classes, event, children }) => {
  return event ? (
    <a 
      href={to}
      target={external ? "_blank" : undefined}
      class="text-blue-500 flex w-full p-1 rounded-sm hover:bg-light-gray"
    >
      {children}
    </a>
  ) : (
    <a 
      href={to}
      target={external ? "_blank" : undefined}
      class="text-blue-500"
    >
      {children}
    </a>
  )
}

export default Link