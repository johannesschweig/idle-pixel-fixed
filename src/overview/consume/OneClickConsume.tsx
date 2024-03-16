import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useItemObserver } from "../setItems/useSetItemsObserver";
import { sendMessage } from "../../util/websocket/useWebsocket";
import LabeledIPimg from "../../util/LabeledIPimg";

interface Props {
  items: ConsumeItem[],
}

export interface ConsumeItem {
  name: string;
  action: string;
  retain?: number;
  action_item?: string;
  action_override?: Array<string>;
  max_value?: number;
  repeat?: boolean;
}


const id = "OneClickConsume";
const OneClickConsume = ({
  items
}: Props) => {
  var itemAmount: number[] = []
  for (let i = 0; i < items.length; i++) {
    const [ia] = useNumberItemObserver(items[i].name, id)
    itemAmount.push(ia)
  }

  const oneClickConsume = () => {
    for (let i = 0; i < items.length; i++) {
      setTimeout(() => {
        sendMessage(items[i].action, items[i].name, itemAmount[i])
      }, 200*i)
    }
  }

  return (itemAmount.reduce((a, b) => a + b, 0) > 0) ? (
    <div
      onClick={() => oneClickConsume()}
    >
      {items.map((item, index) => (
        <LabeledIPimg
          name={item.name}
          label={itemAmount[index]}
          size={15}
          />
      ))}
    </div>
  ) : null;
};

export default OneClickConsume;
