import { ContextValue, MConnectionExplorer, NSDatabase } from "@sqltools/types";
import AbstractDriver from "@sqltools/base-driver";

async function getDistinctDatabases(driver: AbstractDriver<any, any>) {
    let connection;
    let result;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
        try {
            connection = await driver.open();
            result = await connection.tables(null, null, null, null);
            break; // Exit the loop if successful
        } catch (error) {
            await driver.close();
            retryCount++;
            if (retryCount >= maxRetries) {
                throw new Error(
                    `Failed to open connection after ${maxRetries} attempts: ${error.message}`
                );
            }
        }
    }
    let tableCats = [];
    let distinctTableCats = new Set();
    result.forEach((row) => {
        tableCats.push(row.TABLE_CAT);
    });
    distinctTableCats = new Set([...tableCats]);
    let distinctDBs = [];
    distinctTableCats.forEach((cat) => {
        distinctDBs.push({
            label: `${cat}`,
            database: `${cat}`,
            type: ContextValue.DATABASE,
            detail: "database",
        });
    });
    distinctDBs.sort((a, b) => a.label.localeCompare(b.label));
    return distinctDBs;
}


async function getSchemas(driver: AbstractDriver<any, any>) {
    let connection;
    let result;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
        try {
            connection = await driver.open();
            result = await connection.tables(null, null, null, null);
            break; // Exit the loop if successful
        } catch (error) {
            await driver.close();
            retryCount++;
            if (retryCount >= maxRetries) {
                throw new Error(
                    `Failed to open connection after ${maxRetries} attempts: ${error.message}`
                );
            }
        }
    }
    let tableSchems = [];
    let distinctTableSchems = new Set();

    result.forEach((row) => {
        if (row.TABLE_TYPE !== "SYSTEM TABLE") {
            tableSchems.push(row.TABLE_SCHEM);
        }
    });

    distinctTableSchems = new Set([...tableSchems]);
    let distinctSchemas = [];

    distinctTableSchems.forEach((schem) => {
        distinctSchemas.push({
            label: `${schem}`,
            schema: `${schem}`,
            type: ContextValue.SCHEMA,
            iconId: "group-by-ref-type",
        });
    });
    distinctSchemas.sort((a, b) => a.label.localeCompare(b.label));
    return distinctSchemas;
}

async function getTables(
    catalog: string | null = null,
    schema: string | null = null,
    tblType: string | null = null,
    childType: string,
    driver: AbstractDriver<any, any>
) {
    const connection = await driver.open();
    const result = await connection.tables(catalog, schema, null, tblType);
    let tables = [];
    let distinctTables = new Set();
    result.forEach((row) => {
        tables.push(row.TABLE_NAME);
    });
    distinctTables = new Set([...tables]);
    let distincts = [];
    distinctTables.forEach((tbl) => {
        distincts.push({
            label: `${tbl}`,
            type: childType,
        });
    });
    return distincts;
}


export async function handleDbSchemaTable(item: any, parent: any, driver: AbstractDriver<any, any>) {
    switch (item.type) {
        case ContextValue.CONNECTION:
        case ContextValue.CONNECTED_CONNECTION:
            return getDistinctDatabases(driver);
        case ContextValue.DATABASE:
            return <MConnectionExplorer.IChildItem[]>[
                {
                    label: "Schemas",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: ContextValue.SCHEMA,
                },
            ];
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
                {
                    label: "Global Temporary",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.globalTemporary",
                },
                {
                    label: "Local Temporary",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.localTemporary",
                },
                {
                    label: "Aliases",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.aliases",
                },
                {
                    label: "Synonyms",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.synonyms",
                },
            ];
        case ContextValue.TABLE:
        case ContextValue.VIEW:
            return driver.getColumns(item as NSDatabase.ITable);
        case ContextValue.RESOURCE_GROUP:
            return handleDbSchemaTableGroup(item, parent, driver);
    }
    return [];
}

export async function handleSchemaTable(item: any, parent: any, driver: AbstractDriver<any, any>) {
    switch (item.type) {
        case ContextValue.CONNECTION:
        case ContextValue.CONNECTED_CONNECTION:
            return getSchemas(driver);
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
                {
                    label: "Global Temporary",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.globalTemporary",
                },
                {
                    label: "Local Temporary",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.localTemporary",
                },
                {
                    label: "Aliases",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.aliases",
                },
                {
                    label: "Synonyms",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.synonyms",
                },
            ];
        case ContextValue.TABLE:
        case ContextValue.VIEW:
            return driver.getColumns(item as NSDatabase.ITable);
        case ContextValue.RESOURCE_GROUP:
            return handleSchemaTableGroup(item, parent, driver);
    }
    return [];
}

async function handleDbSchemaTableGroup(item: any, parent: any, driver: AbstractDriver<any, any>) {
    switch (item.childType) {
        case ContextValue.SCHEMA:
            return getSchemas(driver);
        case ContextValue.TABLE:
            return getTables(null, parent.label, "TABLE", item.childType, driver);
        case ContextValue.VIEW:
            return getTables(null, parent.label, "VIEW", item.childType, driver);
        case "connection.globalTemporary":
            return getTables(
                null,
                parent.label,
                "GLOBAL TEMPORARY",
                item.childType,
                driver
            );
        case "connection.localTemporary":
            return getTables(
                null,
                parent.label,
                "LOCAL TEMPORARY",
                item.childType,
                driver
            );
        case "connection.aliases":
            return getTables(null, parent.label, "ALIAS", item.childType, driver);
        case "connection.synonyms":
            return getTables(null, parent.label, "SYNONYM", item.childType, driver);
    }
}

async function handleSchemaTableGroup(item: any, parent: any, driver: AbstractDriver<any, any>) {
    switch (item.childType) {
        case ContextValue.TABLE:
            return getTables(null, parent.label, "TABLE", item.childType, driver);
        case ContextValue.VIEW:
            return getTables(null, parent.label, "VIEW", item.childType, driver);
        case "connection.globalTemporary":
            return getTables(
                null,
                parent.label,
                "GLOBAL TEMPORARY",
                item.childType,
                driver
            );
        case "connection.localTemporary":
            return getTables(
                null,
                parent.label,
                "LOCAL TEMPORARY",
                item.childType,
                driver
            );
        case "connection.aliases":
            return getTables(null, parent.label, "ALIAS", item.childType, driver);
        case "connection.synonyms":
            return getTables(null, parent.label, "SYNONYM", item.childType, driver);
    }
}