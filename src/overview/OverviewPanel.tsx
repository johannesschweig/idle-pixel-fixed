import { closeOverview, selectOverviewIsOpen } from "./overviewReducer";
import { useIPFDispatch, useIPFSelector } from "../redux/hooks";
import BrewingOverview from "./brewing/BrewingOverview";
import { useEffect, useRef } from "react";
import { useRefreshMarketSlotDataObserver, useSetItemsObserver } from "./setItems/useSetItemsObserver";
import WoodcuttingOverview from "./woodcutting/WoodcuttingOverview";
import CraftingOverview from "./crafting/CraftingOverview";
import MiningOverview from "./mining/MiningOverview";
import ConsumeOverview from "./consume/ConsumeOverview";
import CombatOverview from "./combat/CombatOverview";
import MarketOverview from "./market/MarketOverview";
import { useLocalStorage } from "../util/localstorage/useLocalStorage";
import {
  ActivityLogItem,
  ActivityLogSettings,
  initialActivitLogSettings,
} from "../activitylog/types";
import ActivityLogEntry from "../activitylog/ActivityLogEntry";
import FarmingOverview from "./farming/FarmingOverview";
import GatheringOverview from "./gathering/GatheringOverview";
import { subscribeToKeyboardEvent } from "../util/keyboard/keyboardReducer";
import {
  ctrlKeyDown,
  ctrlKeyUp,
  shiftKeyDown,
  shiftKeyUp,
} from "../util/keyboard/modiferKeyReducer";
import OverviewBox from "./OverviewBox";
import { useOpenRocketDialogueObserver } from "./consume/useRocketObserver";

const id = "OverviewPanel";
const OverviewPanel = () => {
  const dispatch = useIPFDispatch();
  const overviewIsOpen = useIPFSelector(selectOverviewIsOpen);
  useSetItemsObserver();
  useRefreshMarketSlotDataObserver();
  useOpenRocketDialogueObserver();

  const [settings] = useLocalStorage<ActivityLogSettings>(
    "activity-log-settings",
    initialActivitLogSettings,
    id
  );

  const oldSwitchPanels = useRef(switch_panels);
  useEffect(() => {
    switch_panels = (id: string) => {
      dispatch(closeOverview());
      oldSwitchPanels.current(id);
    };
  }, []);

  const [list] = useLocalStorage<ActivityLogItem[]>("activity-log", [], id);

  useEffect(() => {
    dispatch(
      subscribeToKeyboardEvent({
        key: "Control",
        onKeyDown: () => {
          dispatch(ctrlKeyDown());
        },
        onKeyUp: () => dispatch(ctrlKeyUp()),
        id: `${id}-ctrl`,
      })
    );
    dispatch(
      subscribeToKeyboardEvent({
        key: "Shift",
        onKeyDown: () => dispatch(shiftKeyDown()),
        onKeyUp: () => dispatch(shiftKeyUp()),
        id: `${id}-shift`,
      })
    );
  }, []);

  return overviewIsOpen ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
          gap: "16px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        <ConsumeOverview />
        <WoodcuttingOverview />
        <FarmingOverview />
        <BrewingOverview />
        <CraftingOverview />
        <CombatOverview />
        <MiningOverview />
        <MarketOverview/>
        <GatheringOverview />
      </div>
      <div>
        {settings.showInOverview && (
          <OverviewBox
            gap={"15px"}
            fontSize={"8px"}
            overflowY={"auto"}
            overflowX={"hidden"}
            justifyContent={"flex-start"}
            border={"unset"}
            height={"100vh"}
          >
            {list.slice(0, 25).map((item) => (
              <ActivityLogEntry item={item} />
            ))}
          </OverviewBox>
        )}
      </div>
    </div>
  ) : null;
};

export default OverviewPanel;
