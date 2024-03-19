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
      const retainOK =
        !items[i].message.message3 && !items[i].message.message3num
          ? true
          : ((items[i].message.message3 === MessageOptions.RETAIN) && (itemAmount[i] > (items[i].message.message3num ?? 0)))
            ? true
            : false
      if (itemAmount[i] > 0 && itemAmount[i] > (items[i].displayLimit ?? 0) && retainOK) {
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
