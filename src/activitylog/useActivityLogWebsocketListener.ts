import { useMemo } from "react";
import { useLocalStorage } from "../util/localstorage/useLocalStorage";
import { ActivityLogItem, ActivityLogItemType, ActivityLogSettings, initialActivitLogSettings, LootItem, } from "./types";
import { consumeWebSocketMessage, observeWebSocketMessage, useWebsocket } from "../util/websocket/useWebsocket";
import { reduceToRecord } from "../util/arrayUtils";

const id = "useActivityLogWebSocketListener"
export const useActivityLogWebSocketListener = () => {
  const [settings] = useLocalStorage<ActivityLogSettings>(
    "activity-log-settings",
    initialActivitLogSettings,
    id
  );

  const [list, setList] = useLocalStorage<ActivityLogItem[]>(
    "activity-log",
    [],
    id
  );

  const addItem = (item: ActivityLogItem) =>
    setList((list) => [item].concat(list).slice(0, 200));

  const onMessageFactory = useMemo(
    () =>
      settings.blockDialogues
        ? consumeWebSocketMessage
        : observeWebSocketMessage,
    [settings.blockDialogues]
  );

  const onLootMessage = useMemo(
    () =>
      onMessageFactory("OPEN_LOOT_DIALOGUE", (data) => {
        //OPEN_LOOT_DIALOGUE=none~images/junk.png~30 Junk~#cce6ff~images/stone.png~3 Stone~#cce6ff
        // OPEN_LOOT_DIALOGUE=none~images/woodcutting.png~1050  Woodcutting xp~#99ff99~images/logs.png~38 Logs~#cce6ff
        addItem(lootDialogueParser(data));
      }),
    [onMessageFactory]
  );
  useWebsocket(onLootMessage, 1000, "useActivityLogWebSocketListener-Loot");

  const onCookedMessage = useMemo(
    () =>
      onMessageFactory("COOKING_RESULTS", (data) => {
        //COOKING_RESULTS=cooked_shrimp~1~50~0~0
        // 1 cooked 50 xp, 0 burnt 0 xp
        addItem(cookDialogueParser(data));
      }),
    [onMessageFactory]
  );
  useWebsocket(onCookedMessage, 1000, "useActivityLogWebSocketListener-Cook");

  // ^(?!SET_ITEMS).+
  const onShowToastMessage = useMemo(
    () =>
      onMessageFactory("SHOW_TOAST", (data) => {
        // SCROLL_TOAST=images/evil_blood.png~red~357 (3570 XP)
        const BLACKLIST = ['foundry', 'furnace', 'seed found', "combat", "brewing", 'magic bonus', 'heat', 'blood moon', 'warning', 'gem found', 'red treasure map found!']
        if (!BLACKLIST.some(item => data.toLowerCase().startsWith(item))) {
          addItem(showToastDialogParser(data.toLowerCase()));
        }
      }),
    [onMessageFactory]
  );
  useWebsocket(onShowToastMessage, 1000, "useActivityLogWebSocketListener-Toast");

  const onOpenDialogueMessage = useMemo(
    () =>
      consumeWebSocketMessage("OPEN_DIALOGUE", (data: string) => {
        console.log("Dialogue blocked", data)
      }),
    [onMessageFactory]
  );
  useWebsocket(onOpenDialogueMessage, 1000, "useActivityLogWebSocketListener-Dialogue");

  return list;
};

const cookDialogueParser = (data: string): ActivityLogItem => {
  const dataArray = data.split("~");
  return {
    type: ActivityLogItemType.COOK,
    timestamp: new Date(),
    content: {
      name: dataArray[0],
      cooked: Number(dataArray[1]),
      cookedXp: Number(dataArray[2]),
      burnt: Number(dataArray[3]),
      burntXp: Number(dataArray[4]),
    },
  };
};

const lootDialogueParser = (data: string): ActivityLogItem => {
  const dataArray = data.split("~");
  return {
    type: ActivityLogItemType.LOOT,
    timestamp: new Date(),
    content: {
      extraData: dataArray[0],
      items: reduceToRecord<LootItem>(dataArray.slice(1, -1), [
        value => ({ background: value }),
        value => ({ image: value }),
        value => ({ label: value }),
      ])
    },
  };
};

const showToastDialogParser = (data: string): ActivityLogItem => {
  const dataArray = data.split("~");
  return {
    type: ActivityLogItemType.TOAST,
    timestamp: new Date(),
    content: {
      action: dataArray[0],
      value: dataArray[1],
    },
  };
}