import { ContextValue, MConnectionExplorer, NSDatabase } from "@sqltools/types";
import AbstractDriver from "@sqltools/base-driver";

export async function handleInformix(item: any, parent: any, driver: AbstractDriver<any, any>) {
    switch (item.type) {
        case ContextValue.CONNECTION:
        case ContextValue.CONNECTED_CONNECTION:
            return await driver.queryResults(driver.queries.fetchDatabases());
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
            ];
        case ContextValue.TABLE:
        case ContextValue.VIEW:
            return driver.getColumns(item as NSDatabase.ITable);
        case ContextValue.RESOURCE_GROUP:
            return handleInformixGroup(item, parent, driver);
    }
    return [];
}

async function handleInformixGroup(item: any, parent: any, driver: AbstractDriver<any, any>) {
    switch (item.childType) {
        case ContextValue.TABLE:
            return driver.queryResults(
                driver.queries.fetchTables(parent as NSDatabase.ISchema)
            );
        case ContextValue.VIEW:
            return driver.queryResults(
                driver.queries.fetchViews(parent as NSDatabase.ISchema)
            );
    }
    return [];
}