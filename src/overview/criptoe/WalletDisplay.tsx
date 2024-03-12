import IPimg from "../../util/IPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { buttonStyle } from "../market/MarketSlotDisplay";
import { formatNumber } from "../../util/numberUtils";

interface Props {
  amount: number;
  price: number;
  walletNum: number;
  withdrawable: boolean;
  withdrawn: boolean;
}

const id = "WalletDisplay";
const WalletDisplay = ({
  amount,
  price,
  walletNum,
  withdrawable,
  withdrawn,
}: Props) => {

  const takeOut = () => {
    const day = new Date().getDay()
    // if not withdrawable, amount is 0 or it is Sunday or Monday
    if (!withdrawable || amount === 0 || day <= 1) {
      return false
    }
    if (price > 25) {
      return true
    }
    // if Friday and price positive
    if (price > 0 && day === 5) {
      return true
    }
    // if Saturday and price larger then -20
    if (price > -20 && day === 6) {
      return true
    }
  }

  return (
    <div
      style={{
        padding: '4px 8px',
        backgroundColor: takeOut() ? "blue" : "white",
        borderRadius: "4px",
        marginBottom: '6px',
        color: takeOut() ? "white" : "grey",
      }}
    >
      {/* <IPimg
        name={item}
        size={20}
        style={{
          marginRight: '4px',
          opacity: action() === Action.NOTHING ? 0.5 : 1.0,
        }}
      />
      {action() === Action.BUY && */}

      { withdrawn && <span
        style={{
          color: "lightgrey",
          fontStyle: "italic",
        }}
      >
        Closed
      </span> }
      { !withdrawn && <span>
        {`${formatNumber(amount)} @ ${price}%`}
      </span> }
      { takeOut() &&
        <div
          className="button"
          style={buttonStyle}
          onClick={() => sendMessage("CRIPTOE_WITHDRAWAL_WALLET", `wallet_${walletNum}`)}>
          Take out
        </div>
      }
    </div>
  );
};

export default WalletDisplay;