export enum ActivityLogItemType {
  LOOT = "LOOT",
  COOK = "COOK",
  TOAST = "TOAST",
}

interface ActivityLogLootItem {
  type: ActivityLogItemType.LOOT;
  content: LootContent;
}

export interface LootContent {
  extraData: string;
  items: LootItem[];
}

export interface LootItem {
  image: string;
  label: string;
  background: string;
}

interface ActivityLogCookItem {
  type: ActivityLogItemType.COOK;
  content: CookContent;
}

interface ActivityLogToastItem {
  type: ActivityLogItemType.TOAST;
  content: ToastContent;
}

export interface CookContent {
  name: string
  cooked: number;
  cookedXp: number;
  burnt: number;
  burntXp: number;
}

export interface ToastContent {
  action: string;
  value: string;
}

interface ActivityLogMetadata {
  timestamp: Date;
}

export type ActivityLogItem = ActivityLogMetadata &
  (ActivityLogCookItem | ActivityLogLootItem | ActivityLogToastItem);

export interface ActivityLogSettings {
  blockDialogues: boolean;
  showInOverview: boolean;
}

export const initialActivitLogSettings: ActivityLogSettings = {
  blockDialogues: true,
  showInOverview: false,
}
