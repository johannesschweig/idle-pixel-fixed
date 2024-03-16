import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useItemObserver } from "../setItems/useSetItemsObserver";
import { sendMessage } from "../../util/websocket/useWebsocket";
import LabeledIPimg from "../../util/LabeledIPimg";

interface Props {
  items: string[],
}


const id = "OneClickConsume";
const OneClickConsume = ({
  items
}: Props) => {
  var itemAmount: number[] = []
  for (let i = 0; i < items.length; i++) {
    const [ia] = useNumberItemObserver(items[i], id)
    itemAmount.push(ia)
  }

  const oneClickConsume = () => {
    for (let i = 0; i < items.length; i++) {
      setTimeout(() => {
        sendMessage("SMASH_STARDUST_PRISM", items[i], itemAmount[i])
      }, 200*i)
    }
  }

  return (itemAmount.reduce((a, b) => a + b, 0) > 0) ? (
    <div
      onClick={() => oneClickConsume()}
    >
      {items.map((item, index) => (
        <div>{item}:{itemAmount[index]}</div>
      ))}
    </div>
  ) : null;
};

export default OneClickConsume;
