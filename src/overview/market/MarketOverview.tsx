import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useMarketSlotDataObserver } from "../setItems/useSetItemsObserver";
import { useEffect, useState } from "react";
import MarketSlotDisplay from "./MarketSlotDisplay";
import MarketSlotPlaceholder from "./MarketSlotPlaceholder";

const id = "MarketOverview";
const InventionOverview = () => {

  const [one] = useMarketSlotDataObserver("1", id)
  const [two] = useMarketSlotDataObserver("2", id)
  const [three] = useMarketSlotDataObserver("3", id)
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    sendMessage("MARKET_REFRESH_SLOTS")
    let name = "unbound_donor_coins"
    // fetch prices for item on load of component
    fetch(`https://idle-pixel.com/market/browse/${name}/`)
      .then(response => response.json())
      .then(data => {
        var marketItemPrices = data.map((item: { market_item_price_each: number; }) => item.market_item_price_each);
        marketItemPrices = marketItemPrices.filter((element: number, index: number) => {
          return element
        });
        setPrices(marketItemPrices)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  return (
    <OverviewBox
      height={250}
      width={550}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          marginTop: "10px",
          gap: "32px",
        }}
      >
        {one.name ?
          <MarketSlotDisplay
            item={one}
            index={1}
          /> :
          <MarketSlotPlaceholder
            index={1}/>
        }
        {two.name ? 
          <MarketSlotDisplay
            item={two}
            index={2}
          /> :
          <MarketSlotPlaceholder
            index={2} />
        }
        {three.name ?
          <MarketSlotDisplay
            item={three}
            index={3}
          /> :
          <MarketSlotPlaceholder
            index={3} />
          }
      </div>
      <span>Unbound donor coins: {prices[0]}</span>
    </OverviewBox>
  );
};

export default InventionOverview;