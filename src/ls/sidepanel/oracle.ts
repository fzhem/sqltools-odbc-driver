import { ContextValue, MConnectionExplorer, NSDatabase } from "@sqltools/types";
import AbstractDriver from "@sqltools/base-driver";

export async function handleOracle(item: any, parent: any, driver: AbstractDriver<any, any>) {
  switch (item.type) {
    case ContextValue.CONNECTION:
    case ContextValue.CONNECTED_CONNECTION:
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
        {
          label: "Other Users",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.users",
        },
      ];
    case ContextValue.TABLE:
    case ContextValue.VIEW:
      return driver.getColumns(item as NSDatabase.ITable);
    case ContextValue.RESOURCE_GROUP:
      return handleOracleGroup(item, driver);
  }
  return [];
}

async function handleOracleGroup(item: any, driver: AbstractDriver<any, any>) {
  switch (item.childType) {
    case ContextValue.TABLE:
      switch (driver.credentials.odbcOptions.oracleTableOptions) {
        case "dba":
          return driver.queryResults(driver.queries.fetchDbaTables());
        case "all":
          return driver.queryResults(driver.queries.fetchAllTables());
        case "user":
          return driver.queryResults(driver.queries.fetchUserTables());
      }
    case ContextValue.VIEW:
      switch (driver.credentials.odbcOptions.oracleViewOptions) {
        case "dba":
          return driver.queryResults(driver.queries.fetchDbaViews());
        case "all":
          return driver.queryResults(driver.queries.fetchAllViews());
        case "user":
          return driver.queryResults(driver.queries.fetchUserViews());
      }
    case "connection.users":
      return driver.queryResults(driver.queries.fetchOtherUsers());
  }
  return [];
}