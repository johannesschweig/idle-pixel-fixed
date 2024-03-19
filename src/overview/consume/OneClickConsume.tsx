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
  message: Message;
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

export function getDefaultMessage(item: string) {
  return {
    message1: "SMASH_STARDUST_PRISM",
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
    // let v = amount - item.retain
    // if (item.action_override) {
    //   const rep = item.repeat ? amount - item.retain : 1
    //   for (let i = 0; i < rep; i++) {
    //     sendMessage(item.action_override[0], ...item.action_override.slice(1))
    //   }
    // } else if (item.action_item) {
    //   sendMessage(item.action, item.action_item, Math.min(v, item.max_amount));
    // } else {
    //   sendMessage(item.action, item.name, Math.min(v, item.max_amount));
    // }
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
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        marginTop: "12px",
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
