import { ContextValue, MConnectionExplorer } from "@sqltools/types";
import AbstractDriver from "@sqltools/base-driver";

export async function handleMSAccess(
  item: any,
  parent: any,
  driver: AbstractDriver<any, any>
) {
  driver.open();
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
          label: "Linked Tables",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.linkedTable",
        },
        {
          label: "Linked ODBC Tables",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.linkedOdbcTable",
        },
        {
          label: "Queries",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.query",
        },
        {
          label: "Forms",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.form",
        },
        {
          label: "Reports",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.report",
        },
        {
          label: "Macros",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.macro",
        },
        {
          label: "Modules",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.module",
        },
        {
          label: "Others",
          type: ContextValue.RESOURCE_GROUP,
          iconId: "folder",
          childType: "connection.other",
        },
      ];
    case ContextValue.RESOURCE_GROUP:
      return handleMSAccessGroup(item, parent, driver);
  }
  return [];
}

async function safeQuery<T>(
  driver: AbstractDriver<any, any>,
  queryFn: () => Promise<T>
): Promise<T | []> {
  try {
    return await queryFn();
  } catch (error) {
    console.error(error);
    driver.close();
    return [];
  }
}

async function handleMSAccessGroup(
  item: any,
  parent: any,
  driver: AbstractDriver<any, any>
) {
  driver.open();

  switch (item.childType) {
    case ContextValue.TABLE:
      return await safeQuery(driver, () =>
        driver.queryResults(driver.queries.fetchTables())
      );
    case "connection.linkedTable":
      return await safeQuery(driver, () =>
        driver.queryResults(driver.queries.fetchLinkedTables())
      );

    case "connection.linkedOdbcTable":
      return await safeQuery(driver, () =>
        driver.queryResults(driver.queries.fetchLinkedODBCTables())
      );

    case "connection.query":
      return await safeQuery(driver, () =>
        driver.queryResults(driver.queries.fetchQueries())
      );

    case "connection.form":
      return await safeQuery(driver, () =>
        driver.queryResults(driver.queries.fetchForms())
      );

    case "connection.report":
      return await safeQuery(driver, () =>
        driver.queryResults(driver.queries.fetchReports())
      );

    case "connection.macro":
      return await safeQuery(driver, () =>
        driver.queryResults(driver.queries.fetchMacros())
      );

    case "connection.module":
      return await safeQuery(driver, () =>
        driver.queryResults(driver.queries.fetchModules())
      );

    case "connection.other":
      return await safeQuery(driver, () =>
        driver.queryResults(driver.queries.fetchOthers())
      );
  }

  return [];
}
