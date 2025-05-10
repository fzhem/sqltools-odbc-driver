import { ContextValue, MConnectionExplorer, NSDatabase } from "@sqltools/types";
import AbstractDriver from "@sqltools/base-driver";

export async function handleSqlServer(item: any, parent: any, driver: AbstractDriver<any, any>) {
    driver.open();
    switch (item.type) {
        case ContextValue.CONNECTION:
        case ContextValue.CONNECTED_CONNECTION:
            let result = await driver.queryResults(driver.queries.fetchDatabases());
            const contextRoot = [
                {
                    label: "Security",
                    database: "Security",
                    type: "connection.security",
                    detail: "security",
                    iconId: "shield",
                },
                {
                    label: "Functions",
                    database: "Functions",
                    type: ContextValue.FUNCTION,
                    detail: "functions",
                    iconId: "code",
                },
                {
                    label: "Stored Procedures",
                    database: "Procedures",
                    type: "connection.storedProceduresRoot",
                    detail: "procedures",
                    iconId: "variable-group",
                },
                {
                    label: "Linked Servers",
                    database: "Linked Servers",
                    type: "connection.linkedServersRoot",
                    detail: "linkedservers",
                    iconId: "link",
                },
            ];
            result = [...result, ...contextRoot];
            if (!driver.credentials.odbcOptions.inaccessibleDatabase) {
                return driver.findAccessibleDatabases(result).then(
                    (accessibleDatabases) => {
                        accessibleDatabases = [...accessibleDatabases, ...contextRoot];
                        return accessibleDatabases;
                    }
                );
            }
            return result;
        case "connection.security":
            return <MConnectionExplorer.IChildItem[]>(<unknown>[
                {
                    label: "Users",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "smiley",
                    childType: "connection.users",
                },
                {
                    label: "Roles",
                    type: "connection.roles",
                    iconId: "organization",
                    childType: ContextValue.RESOURCE_GROUP,
                },
            ]);
        case "connection.roles":
            return <MConnectionExplorer.IChildItem[]>(<unknown>[
                {
                    label: "Database Roles",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.dbRoles",
                },
                {
                    label: "Application Roles",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.appRoles",
                },
            ]);
        case ContextValue.TABLE:
        case ContextValue.VIEW:
            if (item.linkedserver) {
                let fallbackColumnResult = await driver.queryResults(
                    driver.queries.fetchLinkedServerColumns(item)
                );
                if (fallbackColumnResult.length === 0) {
                    try {
                        const showRecordsResult = await driver.showRecords(item, {
                            limit: 1,
                        });
                        if (showRecordsResult.length === 0) {
                            return [];
                        }
                        const distinctColumns = Object.keys(
                            showRecordsResult[0].results[0]
                        );
                        return distinctColumns.map((key) => ({
                            label: key,
                            type: ContextValue.COLUMN,
                            table: item.label,
                            dataase: item.database,
                            schema: item.schema,
                            childType: ContextValue.NO_CHILD,
                        }));
                    } catch (error) {
                        driver.close();
                        return [];
                    }
                }
                fallbackColumnResult = fallbackColumnResult.filter(
                    (column) =>
                        column.TYPE_NAME !== "INTERVAL YEAR TO MONTH" &&
                        column.TYPE_NAME !== "INTERVAL DAY TO SECOND"
                );
                const transformedColumns = fallbackColumnResult.map((column) => {
                    const detail = column.CHAR_OCTET_LENGTH
                        ? `${column.TYPE_NAME}(${column.CHAR_OCTET_LENGTH})`
                        : column.TYPE_NAME;

                    return {
                        label: column.COLUMN_NAME,
                        type: "connection.fallbackColumn",
                        table: column.TABLE_NAME,
                        dataType: column.TYPE_NAME,
                        detail: detail,
                        database: column.TABLE_CAT,
                        schema: column.TABLE_SCHEM,
                        isNullable: column.IS_NULLABLE,
                        iconId: "symbol-field",
                        childType: ContextValue.NO_CHILD,
                    };
                });

                return transformedColumns;
            }
            return driver.getColumns(item as NSDatabase.ITable);
        case ContextValue.DATABASE:
            return <MConnectionExplorer.IChildItem[]>[
                {
                    label: "Schemas",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: ContextValue.SCHEMA,
                },
                {
                    label: "Synonyms",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.synonyms",
                },
            ];
        case ContextValue.RESOURCE_GROUP:
            return handleSqlServerGroup(item, parent, driver);
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
                    label: "Triggers",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.triggerstable",
                },
            ];
        case ContextValue.FUNCTION:
            return <MConnectionExplorer.IChildItem[]>(<unknown>[
                {
                    label: "Table-valued Functions",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.tableValuedFunctions",
                },
                {
                    label: "Scalar-valued Functions",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.scalarFunctions",
                },
                {
                    label: "Aggregate Functions",
                    type: ContextValue.RESOURCE_GROUP,
                    iconId: "folder",
                    childType: "connection.aggFunctions",
                },
            ]);
        case "connection.tableValuedFunctions":
        case "connection.scalarFunctions":
        case "connection.aggFunctions":
        case "connection.storedProcedures":
            return driver.queryResults(driver.queries.fetchParameters(item));
        case "connection.storedProceduresRoot":
            return driver.queryResults(driver.queries.fetchStoredProcedures());
        case "connection.linkedServersRoot":
            try {
                const result = await driver.queryResults(
                    driver.queries.fetchLinkedServers()
                );
                return result;
            } catch (error) {
                driver.close();
                return [];
            }
        case "connection.triggerstable":
            try {
                return await driver.queryResults(
                    driver.queries.fetchTriggers(item as NSDatabase.ITable)
                );
            } catch (error) {
                driver.close();
                return [];
            }
        case "connection.linkedServers":
            try {
                const result = await driver.queryResults(
                    driver.queries.fetchLinkedServerCatalogs(item)
                );
                const transformedResult = result.map((out) => ({
                    label: out.CATALOG_NAME,
                    database: out.CATALOG_NAME,
                    type: ContextValue.DATABASE,
                    detail: "database",
                    linkedserver: item.linkedserver,
                }));
                return transformedResult;
            } catch (error) {
                console.log(
                    "Error while fetching linked servers:",
                    error,
                    "\n----Using a fallback method----"
                );
                try {
                    const result = await driver.queryResults(
                        driver.queries.fetchLinkedServerDatabaseAndSchemas(item)
                    );
                    const distinctValues = Array.from(
                        new Set(
                            result.map((item) => `${item.TABLE_CAT}:${item.TABLE_SCHEM}`)
                        )
                    ).map((item) => {
                        const [TABLE_CAT, TABLE_SCHEM] = item.split(":");
                        return {
                            TABLE_CAT: TABLE_CAT === "null" ? null : TABLE_CAT,
                            TABLE_SCHEM,
                        };
                    });
                    const fallbackDatabases = distinctValues.map((out) => ({
                        label: out.TABLE_CAT,
                        database: out.TABLE_CAT,
                        schema: out.TABLE_SCHEM,
                        type: "connection.fallbackDatabase",
                        detail: "database",
                        linkedserver: item.linkedserver,
                        iconId: "database",
                    }));
                    const fallbackSchemas = distinctValues.map((out) => ({
                        label: out.TABLE_SCHEM,
                        database: out.TABLE_CAT,
                        schema: out.TABLE_SCHEM,
                        type: "connection.fallbackSchema",
                        detail: "schema",
                        linkedserver: item.linkedserver,
                        iconId: "group-by-ref-type",
                    }));
                    if (!result.every((row) => row.TABLE_CAT === null)) {
                        return fallbackDatabases;
                    } else {
                        return fallbackSchemas;
                    }
                } catch (error) {
                    console.error("Error in fallback method:", error);
                    driver.close();
                    return [];
                }
            }
        case "connection.fallbackDatabase":
            try {
                const result = await driver.queryResults(
                    driver.queries.fetchLinkedServerSchemas(item)
                );
                const distinctSchem = [
                    ...new Set(result.map((row) => row.TABLE_SCHEM)),
                ];
                const distinctSchemObjects = distinctSchem.map((schem) => ({
                    TABLE_SCHEM: schem,
                }));
                const fallbackSchemas = distinctSchemObjects.map((out) => ({
                    label: out.TABLE_SCHEM,
                    database: item.database,
                    schema: out.TABLE_SCHEM,
                    type: "connection.fallbackSchema",
                    detail: "schema",
                    linkedserver: item.linkedserver,
                    iconId: "group-by-ref-type",
                }));
                return fallbackSchemas;
            } catch (error) {
                driver.close();
                return [];
            }
        case "connection.fallbackSchema":
            return [
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
    }
    return [];
}


async function handleSqlServerGroup(item: any, parent: any, driver: AbstractDriver<any, any>) {
    driver.open();
    switch (item.childType) {
        case ContextValue.SCHEMA:
            if (driver.credentials.odbcOptions.inaccessibleSchema) {
                try {
                    const result = await driver.queryResults(
                        driver.queries.fetchSchemas(parent)
                    );
                    return result;
                } catch (error) {
                    driver.close();
                    return [];
                }
            } else {
                try {
                    const result = await driver.queryResults(
                        driver.queries.fetchSchemasExcludingEmpty(parent)
                    );
                    return result;
                } catch (error) {
                    driver.close();
                    return [];
                }
            }
        case ContextValue.TABLE:
            if (parent.linkedserver) {
                const resultsFallbackTables = await driver.queryResults(
                    driver.queries.fetchLinkedServerTables(parent)
                );
                const transformedResultsFallbackTables = resultsFallbackTables.map(
                    (out) => ({
                        label: out.TABLE_NAME,
                        database: out.TABLE_CAT,
                        schema: out.TABLE_SCHEM,
                        type: ContextValue.TABLE,
                        isView: 0,
                        linkedserver: parent.linkedserver,
                        iconName: "table",
                    })
                );
                return transformedResultsFallbackTables;
            }
            return driver.queryResults(
                driver.queries.fetchTables(parent as NSDatabase.ISchema)
            );
        case ContextValue.VIEW:
            if (parent.linkedserver) {
                const resultsFallbackViews = await driver.queryResults(
                    driver.queries.fetchLinkedServerViews(parent)
                );
                const transformedResultsFallbackViews = resultsFallbackViews.map(
                    (out) => ({
                        label: out.TABLE_NAME,
                        database: out.TABLE_CAT,
                        schema: out.TABLE_SCHEM,
                        type: ContextValue.VIEW,
                        isView: 1,
                        linkedserver: parent.linkedserver,
                        iconName: "view",
                    })
                );
                return transformedResultsFallbackViews;
            }
            return driver.queryResults(
                driver.queries.fetchViews(parent as NSDatabase.ISchema)
            );
        case "connection.scalarFunctions":
            return driver.queryResults(driver.queries.fetchScalarFunctions());
        case "connection.tableValuedFunctions":
            return await driver.queryResults(
                driver.queries.fetchTableValuedFunctions()
            );
        case "connection.aggFunctions":
            return await driver.queryResults(driver.queries.fetchAggregateFunctions());
        case "connection.synonyms":
            try {
                const resultsSynonyms = await driver.queryResults(
                    driver.queries.fetchSynonyms(parent as NSDatabase.ISchema)
                );
                return resultsSynonyms.map((col) => ({
                    ...col,
                    childType: ContextValue.NO_CHILD,
                }));
            } catch (error) {
                driver.close();
                return [];
            }
        case "connection.triggerstable":
            try {
                return await driver.queryResults(
                    driver.queries.fetchTriggersTable(parent as NSDatabase.ISchema)
                );
            } catch (error) {
                driver.close();
                return [];
            }
        case "connection.users":
            const resultsUsers = await driver.queryResults(driver.queries.fetchUsers());
            return resultsUsers.map((col) => ({
                ...col,
                childType: ContextValue.NO_CHILD,
            }));
        case "connection.dbRoles":
            const resultsDatabaseRoles = await driver.queryResults(
                driver.queries.fetchDatabaseRoles()
            );
            return resultsDatabaseRoles.map((col) => ({
                ...col,
                childType: ContextValue.NO_CHILD,
            }));
    }
    return [];
}