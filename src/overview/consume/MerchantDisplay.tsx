import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useItemObserver } from "../setItems/useSetItemsObserver";
import LabeledIPimg from "../../util/LabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";


const id = "MerchantDisplay";
const MerchantDisplay = ({
}) => {
  const [merchantTimer] = useNumberItemObserver("merchant_timer", id)
  const [barterAmountOne] = useNumberItemObserver("merchant_barter_amount_1", id)
  const [barterAmountTwo] = useNumberItemObserver("merchant_barter_amount_2", id)
  const [barterAmountThree] = useNumberItemObserver("merchant_barter_amount_3", id)
  const [barterItemOne] = useItemObserver("merchant_barter_item_1", id)
  const [barterItemTwo] = useItemObserver("merchant_barter_item_2", id)
  const [barterItemThree] = useItemObserver("merchant_barter_item_3", id)
  const [sellingAmountOne] = useNumberItemObserver("merchant_selling_item_amount_1", id)
  const [sellingAmountTwo] = useNumberItemObserver("merchant_selling_item_amount_2", id)
  const [sellingAmountThree] = useNumberItemObserver("merchant_selling_item_amount_3", id)
  const [sellingItemOne] = useItemObserver("merchant_selling_item_1", id)
  const [sellingItemTwo] = useItemObserver("merchant_selling_item_2", id)
  const [sellingItemThree] = useItemObserver("merchant_selling_item_3", id)

  return merchantTimer === 0 ? (
    <div
      onClick={() => sendMessage("ROTATE_MERCHANT")}
      style={{
        display: "flex",
        cursor: 'pointer',
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
        }}
      >Merchant sells:</div>
      {
        [
          [sellingItemOne, sellingAmountOne, barterItemOne, barterAmountOne],
          [sellingItemTwo, sellingAmountTwo, barterItemTwo, barterAmountTwo],
          [sellingItemThree, sellingAmountThree, barterItemThree, barterAmountThree]
        ].map(offer => (
          <div>
            <LabeledIPimg
              name={offer[0].toString()}
              label={offer[1]}
              size={20}
              style={{
                display: "inline-block",
              }}
            />
            <span
              style={{
                marginRight: "12px",
              }}
            >for</span>
            <LabeledIPimg
              name={offer[2].toString()}
              label={offer[3]}
              size={20}
              style={{
                display: "inline-block",
              }}
            />
          </div>
        ))
      }
    </div>
  ) : null;
};

export default MerchantDisplay;
