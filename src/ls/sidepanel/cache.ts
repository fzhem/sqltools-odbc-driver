import { ContextValue, MConnectionExplorer, NSDatabase } from "@sqltools/types";
import AbstractDriver from "@sqltools/base-driver";

export async function handleCache(item: any, parent: any, driver: AbstractDriver<any, any>) {
  switch (item.type) {
    case ContextValue.CONNECTION:
    case ContextValue.CONNECTED_CONNECTION:
      return driver.queryResults(driver.queries.fetchSchemas());
    case ContextValue.SCHEMA:
      return <MConnectionExplorer.IChildItem[]>[
        {
          label: "Tables",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: ContextValue.TABLE,
        },
        {
          label: "Views",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: ContextValue.VIEW,
        },
      ];
    case ContextValue.TABLE:
    case ContextValue.VIEW:
      return driver.getColumns(item as NSDatabase.ITable);
    case ContextValue.RESOURCE_GROUP:
      return handleCacheGroup(item, parent, driver);
  }
  return [];
}

async function handleCacheGroup(item: any, parent: any, driver: AbstractDriver<any, any>) {
  switch (item.childType) {
    case ContextValue.TABLE:
      return await driver.queryResults(driver.queries.fetchTables(parent as NSDatabase.ISchema));
    case ContextValue.VIEW:
      return [];
  }
  return [];
}