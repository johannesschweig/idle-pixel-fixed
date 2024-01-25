import IPimg from "../../util/IPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { buttonStyle } from "../market/MarketSlotDisplay";
import { formatNumber } from "../../util/numberUtils";

interface Props {
  amount: number;
  price: number;
  walletNum: number;
  withdrawable: boolean;
}

const id = "WalletDisplay";
const WalletDisplay = ({
  amount,
  price,
  walletNum,
  withdrawable
}: Props) => {

  const getBg = 'rgb(114, 181, 192)'
  // item.sold === 0 ? 'rgb(114, 181, 192)' :
  //   item.amount === 0 ? 'gold'
  //     : 'rgba(255, 215, 0, 0.5)'

  const getFontSize = () => {
    const absPrice = Math.abs(price)
    if (absPrice > 200) {
      return 40
    } else if (absPrice > 100) {
      return 32
    } else if (absPrice > 40) {
      return 20
    } else if (absPrice > 20) {
      return 16
    } else {
      return 14
    }
  }

  return (
    <div
      style={{
        backgroundColor: getBg,
        padding: "16px",
        display: "grid",
        justifyItems: "center",
        gap: "8px",
        opacity: amount > 0 ? 1 : 0.5,
      }}
    >
      <div
        style={{
          color: price > 0 ? "darkgreen" : "darkred",
          fontSize: `${getFontSize()}px`
        }}
      >{price}%</div>
      <div>
        {formatNumber(amount)}
        <IPimg
          name={"criptoe_coin"}
          size={10} />
      </div>
      {
        price > 25 && amount > 0 && withdrawable &&
        <div
          className="button"
          style={buttonStyle}
          onClick={() => sendMessage("CRIPTOE_WITHDRAWAL_WALLET", `wallet_${walletNum}`)}>
          Cash out +{Math.round(price/100*amount)}
        </div>
      }
    </div>
  );
};

export default WalletDisplay;