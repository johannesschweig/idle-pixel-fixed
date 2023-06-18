import { sendMessage } from "../../util/websocket/useWebsocket";
import { MarketData } from "../setItems/useSetItemsObserver";
import { useState, ChangeEvent } from "react";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import IPimg from "../../util/IPimg";
import { buttonStyle } from "./MarketSlotDisplay";

interface Props {
  index: number,
}

const TRADEABLES = ["sapphire", "emerald", "ruby", "diamond", "stone", "copper", "iron", "silver", "gold", "promethium", "titanium", "ancient_ore", "moonstone", "bronze_bar", "iron_bar", "silver_bar", "gold_bar", "promethium_bar", "titanium_bar", "ancient_bar", "bones", "big_bones", "ashes", "ice_bones", "blood_bones", "dotted_green_leaf_seeds", "green_leaf_seeds", "lime_leaf_seeds", "gold_leaf_seeds", "crystal_leaf_seeds", "red_mushroom_seeds", "stardust_seeds", "tree_seeds", "oak_tree_seeds", "willow_tree_seeds", "maple_tree_seeds", "stardust_tree_seeds", "pine_tree_seeds", "redwood_tree_seeds", "dotted_green_leaf", "green_leaf", "lime_leaf", "gold_leaf", "crystal_leaf", "red_mushroom", "strange_leaf", "logs", "oak_logs", "willow_logs", "maple_logs", "stardust_logs", "pine_logs", "redwood_logs", "stinger", "iron_dagger", "skeleton_sword", "club", "spiked_club", "scythe", "trident", "rapier", "long_bow", "wooden_arrows", "fire_arrows", "ice_arrows", "cannon", "lizard_skin", "bear_fur", "bat_skin", "crocodile_hide", "skeleton_shield", "bone_amulet", "raw_shrimp", "raw_anchovy", "raw_sardine", "raw_crab", "raw_piranha", "raw_salmon", "raw_trout", "raw_pike", "raw_eel", "raw_rainbow_fish", "raw_tuna", "raw_swordfish", "raw_manta_ray", "raw_shark", "raw_whale", "cooked_shrimp", "cooked_anchovy", "cooked_sardine", "cooked_crab", "cooked_piranha", "cooked_salmon", "cooked_trout", "cooked_pike", "cooked_eel", "cooked_rainbow_fish", "cooked_tuna", "cooked_swordfish", "cooked_manta_ray", "cooked_shark", "cooked_whale", "unbound_donor_coins", "blue_pickaxe_orb", "blue_hammer_orb", "blue_oil_storage_orb", "blue_oil_well_orb", "blue_farming_orb", "blue_woodcutting_orb", "green_charcoal_orb", "green_arrow_orb", "green_bone_orb", "green_log_orb", "green_boat_orb", "red_farming_orb", "red_woodcutting_orb", "red_combat_orb", "red_oil_factory_orb", "red_stardust_watch_orb"]

const id = "MarketSlotPlaceholder";
const MarketSlotPlaceholder = ({
  index,
}: Props) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }
  const changeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(event.target.value))
  }
  const changePrice = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(parseInt(event.target.value))
  }

  const postOffer = () => {
    sendMessage('MARKET_POST', index, name, amount, price)
    sendMessage("MARKET_REFRESH_SLOTS")
  }

  const labelStyle = {
    fontSize: "14px",
    marginRight: "8px",
  }

  return (
    <div
      style={{
        backgroundColor: 'rgb(114, 181, 192)',
        padding: "16px",
        display: "grid",
        gap: "8px",
      }} >
      <p>
        <input
          type="text"
          value={name}
          onChange={changeName}
          placeholder="Name"
          // autocomplete="off"
          list="suggestions"
        />
        <datalist id="suggestions">
          {TRADEABLES.map(t =>
            <option value={t} />
          )}
        </datalist>
      </p>
      <p>
        <span
          style={labelStyle}
        >Amount:</span>
        <input
          type="number"
          value={amount}
          onChange={changeAmount}
          style={{
            width: "50px",
          }}
        />
      </p>
      <p>
        <span
          style={labelStyle}
        >Price:</span>
        <input
          type="number"
          value={price}
          onChange={changePrice}
          style={{
            width: "50px",
          }}
        />
      </p>
      <div
        style={buttonStyle}
        onClick={() => postOffer()}
      >
        Add
      </div>
    </div >
  )

};

export default MarketSlotPlaceholder;