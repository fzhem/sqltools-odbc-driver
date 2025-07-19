import { ContextValue, MConnectionExplorer, NSDatabase } from "@sqltools/types";
import AbstractDriver from "@sqltools/base-driver";

export async function handleMySql(
  item: any,
  parent: any,
  driver: AbstractDriver<any, any>
) {
  driver.open();
  switch (item.type) {
    case ContextValue.CONNECTION:
    case ContextValue.CONNECTED_CONNECTION:
      return await driver.queryResults(driver.queries.fetchDatabases(item));
    case ContextValue.TABLE:
    case ContextValue.VIEW:
      return driver.getColumns(item as NSDatabase.ITable);
    case ContextValue.DATABASE:
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
          label: "Functions",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: ContextValue.FUNCTION,
        },
        {
          label: "Stored Procedures",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.storedProceduresRoot",
        },
      ];
    case ContextValue.RESOURCE_GROUP:
      return handleMySqlGroup(item, parent, driver);
  }
  return [];
}

async function handleMySqlGroup(
  item: any,
  parent: any,
  driver: AbstractDriver<any, any>
) {
  driver.open();
  console.log('parent', parent);
  switch (item.childType) {
    case ContextValue.TABLE:
      return driver.queryResults(
        driver.queries.fetchTables(parent as NSDatabase.ISchema)
      );
    case ContextValue.VIEW:
      return driver.queryResults(
        driver.queries.fetchViews(parent as NSDatabase.ISchema)
      );
    case ContextValue.FUNCTION:
      return driver.queryResults(driver.queries.fetchFunctions(parent as NSDatabase.ISchema));
    case "connection.storedProceduresRoot":
      return driver.queryResults(driver.queries.fetchStoredProcedures(parent as NSDatabase.ISchema));
  }
  return [];
}
