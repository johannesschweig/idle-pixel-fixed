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

  const imgStyle = {
    display: "inline-block",
  }

  const spanStyle = {
    marginRight: "12px",
  }

  return merchantTimer >= 0 ? (
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
      <div>
        <LabeledIPimg
          name={sellingItemOne}
          label={sellingAmountOne}
          size={20}
          style={imgStyle}
        />
        <span
          style={spanStyle}
        >for</span>
        <LabeledIPimg
          name={barterItemOne}
          label={barterAmountOne}
          size={20}
          style={imgStyle}
        />
      </div>
      <div>
        <LabeledIPimg
          name={sellingItemTwo}
          label={sellingAmountTwo}
          size={20}
          style={imgStyle}
        />
        <span
          style={spanStyle}
        >for</span>
        <LabeledIPimg
          name={barterItemTwo}
          label={barterAmountTwo}
          size={20}
          style={imgStyle}
        />
      </div>
      <div>
        <LabeledIPimg
          name={sellingItemThree}
          label={sellingAmountThree}
          size={20}
          style={imgStyle}
        />
        <span
          style={spanStyle}
        >for</span>
        <LabeledIPimg
          name={barterItemThree}
          label={barterAmountThree}
          size={20}
          style={imgStyle}
        />
      </div>
    </div>
  ) : null;
};

export default MerchantDisplay;
