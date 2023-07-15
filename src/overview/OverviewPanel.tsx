import { closeOverview, selectOverviewIsOpen } from "./overviewReducer";
import { useIPFDispatch, useIPFSelector } from "../redux/hooks";
import BrewingOverview from "./brewing/BrewingOverview";
import { useEffect, useRef } from "react";
import { useRefreshMarketSlotDataObserver, useSetItemsObserver } from "./setItems/useSetItemsObserver";
import WoodcuttingOverview from "./woodcutting/WoodcuttingOverview";
import CraftingOverview from "./crafting/CraftingOverview";
import MiningOverview from "./mining/MiningOverview";
import InventionOverview from "./invention/InventionOverview";
import FishingOverview from "./fishing/FishingOverview";
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
import { useOpenRocketDialogueObserver, useRocketObserver } from "./mining/useRocketObserver";

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
        display: "flex",
        gap: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              alignItems: "center",
            }}
          >
            <WoodcuttingOverview />
            <FarmingOverview />
            <CombatOverview />
            <MarketOverview />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              alignItems: "center",
              width: "50%%",
            }}
          >
            <BrewingOverview />
            <GatheringOverview />
            <InventionOverview />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              alignItems: "center",
              width: "50%%",
            }}
          >
            <CraftingOverview />
            <MiningOverview />
            <FishingOverview />
          </div>
        </div>
      </div>
      {settings.showInOverview && (
        <OverviewBox
          height={800}
          width={400}
          gap={"15px"}
          fontSize={"8px"}
          overflowY={"auto"}
          overflowX={"hidden"}
          justifyContent={"flex-start"}
          border={"unset"}
        >
          {list.slice(0, 25).map((item) => (
            <ActivityLogEntry item={item} />
          ))}
        </OverviewBox>
      )}
    </div>
  ) : null;
};

export default OverviewPanel;
