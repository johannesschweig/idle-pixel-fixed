import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useItemObserver } from "../setItems/useSetItemsObserver";
import { sendMessage } from "../../util/websocket/useWebsocket";
import LabeledIPimg from "../../util/LabeledIPimg";
import { buttonStyle } from "../market/MarketSlotDisplay";
import { isVisible } from "./isVisible";

interface Props {
  items: ConsumeItem[],
}

export interface ConsumeItem {
  name: string;
  message: Message;
  displayLimit?: number;
}

interface Message {
  message1: string;
  message2?: string | MessageOptions;
  message3?: string | MessageOptions;
  message3num?: number;
  repeat?: boolean;
}

export enum MessageOptions {
  MAX = 'max',
  RETAIN = 'retain'
}

export function getDefaultMessage(action: string, item: string) {
  return {
    message1: action,
    message2: item,
    message3: MessageOptions.MAX
  }
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
    const repeat = item.message.repeat ? amount : 1
    if (!item.message.message2) {
      for (let i = 0; i < repeat; i++) {
        sendMessage(item.message.message1)
      }
    } else if (item.message.message3) {
      const message3 = typeof item.message.message3 === 'number'
        ? item.message.message3
        : item.message.message3 === MessageOptions.MAX
          ? amount
          : item.message.message3 === MessageOptions.RETAIN && item.message.message3num
            ? amount - item.message.message3num
            : 0
      sendMessage(item.message.message1, item.message.message2, message3)
    }
  }

  const consumeAll = () => {
    let j = 0
    const visible = getVisible()
    for (let i = 0; i < visible.items.length; i++) {
      setTimeout(() => {
        consumeItem(visible.items[i], visible.amount[i])
      }, 200 * i)
    }
  }

  const getVisible = () => {
    var visItems: ConsumeItem[] = []
    var visItemsAm = []
    for (let i = 0; i < items.length; i++) {
      if (isVisible(items[i], itemAmount[i])) {
        visItems.push(items[i])
        visItemsAm.push(itemAmount[i])
      }
    }
    return {
      items: visItems,
      amount: visItemsAm
    }
  }

  return (itemAmount.reduce((a, b) => a + b, 0) > 0) ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        marginTop: "12px",
      }}
      onClick={() => consumeAll()}
    >
      {getVisible().items.map((item: ConsumeItem, index: number) => (
        <LabeledIPimg
          name={item.name}
          label={getVisible().amount[index]}
          size={15}
        />
      ))}
    </div>
  ) : null;
};

export default OneClickConsume;
