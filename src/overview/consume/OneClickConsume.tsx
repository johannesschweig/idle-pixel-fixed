import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useItemObserver } from "../setItems/useSetItemsObserver";
import { sendMessage } from "../../util/websocket/useWebsocket";
import LabeledIPimg from "../../util/LabeledIPimg";
import { buttonStyle } from "../market/MarketSlotDisplay";

interface Props {
  items: ConsumeItem[],
}

export interface ConsumeItem {
  name: string;
  action: string;
  retain?: number;
  action_item?: string;
  action_override?: Array<string>;
  max_amount?: number;
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

  const consumeItem = (item: ConsumeItem, amount: number) => {
    if (!item.retain) {
      item.retain = 0
    }
    if (!item.max_amount) {
      item.max_amount = Math. pow(10, 1000)
    }

    let v = amount - item.retain
    if (item.action_override) {
      const rep = item.repeat ? amount - item.retain : 1
      for (let i = 0; i < rep; i++) {
        sendMessage(item.action_override[0], ...item.action_override.slice(1))
      }
    } else if (item.action_item) {
      sendMessage(item.action, item.action_item, Math.min(v, item.max_amount));
    } else {
      sendMessage(item.action, item.name, Math.min(v, item.max_amount));
    }
  }

  const consumeAll = () => {
    let j = 0
    const visItems = visibleItems()
    for (let i = 0; i < visItems.length; i++) {
      setTimeout(() => {
        consumeItem(visItems[i], visibleItemAmount[i])
      }, 200 * i)
    }
  }

  const visibleItems = () => {
    var visItems: ConsumeItem[] = []
    for (let i = 0; i < items.length; i++) {
      if (itemAmount[i] > 0) {
        visItems.push(items[i])
      }
    }
    return visItems
  }

  const visibleItemAmount = itemAmount.filter(ia => ia > 0)

  return (itemAmount.reduce((a, b) => a + b, 0) > 0) ? (
    <div
      style={{
        display: "flex",
      }}
      onClick={() => consumeAll()}
    >
      {visibleItems().map((item: ConsumeItem, index: number) => (
        <LabeledIPimg
          name={item.name}
          label={visibleItemAmount[index]}
          size={15}
        />
      ))}
    </div>
  ) : null;
};

export default OneClickConsume;
