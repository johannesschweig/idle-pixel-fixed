import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useItemObserver } from "../setItems/useSetItemsObserver";
import { sendMessage } from "../../util/websocket/useWebsocket";
import LabeledIPimg from "../../util/LabeledIPimg";


const id = "CookBook";
const CookBook = ({
}) => {
  const [cooksBookTimer] = useNumberItemObserver("cooks_book_timer", id)
  const [cooksBookItem] = useItemObserver("cooks_book_item", id)
  const [coconut] = useNumberItemObserver("coconut", id)
  const [banana] = useNumberItemObserver("banana", id)
  const [potato] = useNumberItemObserver("potato", id)
  const [carrot] = useNumberItemObserver("carrot", id)
  const [beet] = useNumberItemObserver("beet", id)
  const [broccoli] = useNumberItemObserver("broccoli", id)

  const clickCooksBook = () => {
    const dish =
      cooksBookTimer === 1
        ? "collect"
        // : broccoli >= 50
        //   ? "broccoli_shake"
        //   : beet >= 50
        //     ? "beet_shake"
        //     : carrot >= 50
        //       ? "carrot_shake"
        //       : potato >= 50
        //         ? "potato_shake"
                : coconut >= 10
                  ? "coconut_stew"
                  : banana >= 10
                    ? "banana_jello"
                    : ""
    if (dish === 'collect') {
      sendMessage("COOKS_BOOK_READY")
    } else if (dish) {
      sendMessage("COOKS_BOOK", dish)
    }
  }

  const name =
    cooksBookTimer === 1
      ? cooksBookItem
      // : broccoli >= 50
      //   ? "broccoli"
      //   : beet >= 50
      //     ? "beet"
      //     : carrot >= 50
      //       ? "carrot"
      //       : potato >= 50
      //         ? "potato"
              : coconut >= 10
                ? "coconut"
                : banana >= 10
                  ? "banana"
                  : ""

  const label = cooksBookTimer === 1 ? `Collect ${cooksBookItem}` : `Cook ${name}s`

  return cooksBookTimer <= 1 ? (
    <LabeledIPimg
      name={name}
      label={label}
      size={50}
      onClick={() => clickCooksBook()}
      style={{
        cursor: "pointer",
      }}
    />
  ) : null;
};

export default CookBook;
