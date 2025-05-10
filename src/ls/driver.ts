import {
  IConnectionDriver,
  NSDatabase,
  ContextValue,
  Arg0,
  IQueryOptions,
  IConnection
} from "@sqltools/types";
import * as cacheQueries from "./queries/cache-queries";
import * as sqlServerQueries from "./queries/sql-server-queries";
import * as informixQueries from "./queries/informix-queries";
import * as oracleQueries from "./queries/oracle-queries";
import { v4 as generateId } from "uuid";
import odbc from "odbc";
import cacheKeywordsCompletion from "./keywords/cache-keywords";
import informixKeywordsCompletion from "./keywords/informix-keywords";
import oracleKeywordsCompletion from "./keywords/oracle-keywords";
import sqlserverKeywordsCompletion from "./keywords/sqlserver-keywords";
import AbstractDriver from "@sqltools/base-driver";
import { handleCache } from "./sidepanel/cache";
import { handleInformix } from "./sidepanel/informix";
import { handleOracle } from "./sidepanel/oracle";
import { handleSqlServer } from "./sidepanel/sql-server";
import { handleDbSchemaTable, handleSchemaTable } from "./sidepanel/generic";


type Credentials = IConnection<any>; // Adjust as per your actual type
type GetWorkspaceFolders = IConnection["workspace"]["getWorkspaceFolders"];

export default class CacheDriver
  extends AbstractDriver<any, any>
  implements IConnectionDriver
{
  private queries: any;

  constructor(
    credentials: Credentials,
    getWorkspaceFolders: GetWorkspaceFolders
  ) {
    super(credentials, getWorkspaceFolders);
    this.configureDriver();
  }

  // Method to configure the driver
  configureDriver() {
    switch (this.credentials.odbcOptions.dbms) {
      case "IBM Informix":
        this.queries = informixQueries;
        break;
      case "InterSystems Caché/IRIS":
        this.queries = cacheQueries;
        break;
      case "Microsoft SQL Server":
        this.queries = sqlServerQueries;
        break;
      case "Oracle":
        this.queries = oracleQueries;
        break;
      default:
        break;
    }
  }

  public getId() {
    return this.credentials.id;
  }

  public async open(): Promise<odbc.Connection> {
    if (this.connection) {
      return this.connection;
    }

    this.connection = this.openConnection(this.credentials);
    return this.connection;
  }

  private async openConnection(
    credentials: IConnection<unknown>
  ): Promise<odbc.Connection> {
    return new Promise((resolve, reject) => {
      let connectionString: string;

      function cleanConnectionString(connectionString: string): string {
        return connectionString
          .split(";")
          .filter((part) => {
            const [key, value] = part.split("=");
            // Keep parts where the value is not 'undefined', 'null', or empty
            return !(
              key &&
              ["DATABASE", "UID", "PWD"].includes(key) &&
              (!value || value === "undefined" || value === "null")
            );
          })
          .join(";");
      }

      switch (credentials.connectionMethod) {
        case "Server and Port":
          connectionString = `DRIVER={${credentials.odbcDriver.driver}};SERVER=${credentials.server};PORT=${credentials.port};DATABASE=${credentials.database};UID=${credentials.username};PWD=${credentials.password}`;
          connectionString = cleanConnectionString(connectionString);
          break;

        case "Connection String":
          connectionString = credentials.connectString;
          break;

        case "DSN":
          connectionString = `DSN=${credentials.dsnString};UID=${credentials.username};PWD=${credentials.password}`;
          connectionString = cleanConnectionString(connectionString);
          break;

        default:
          return reject(new Error("Invalid connection method"));
      }

      odbc.connect(connectionString, (err, conn) => {
        if (err) {
          let combinedMessage: string = "";

          if (err.odbcErrors && err.odbcErrors.length > 0) {
            combinedMessage += err.odbcErrors.map((e) => e.message).join("\n");
          } else {
            combinedMessage = err.message || "An unknown error occurred";
          }
          reject(new Error(combinedMessage));
        } else {
          resolve(conn);
        }
      });
    });
  }

  public async close() {
    if (!this.connection) {
      return;
    }

    const conn = await this.connection;
    conn.close();
    (this.connection as any) = null;
  }

  public async testConnection() {
    await this.open();
    switch (this.credentials.odbcOptions.dbms) {
      case "IBM Informix":
        await this.query("select 1 from table(set{1})", {});
        break;
      case "Oracle":
        await this.query("SELECT SYSDATE FROM dual", {});
        break;
      default:
        await this.query(
          "SELECT TOP 2 TABLE_NAME FROM INFORMATION_SCHEMA.TABLES",
          {}
        );
        break;
    }
  }

  async showRecords(
    table: NSDatabase.ITable,
    opt: IQueryOptions & {
      limit: number;
      page?: number;
    }
  ): Promise<NSDatabase.IResult<any>[]> {
    const conn = await this.open();
    let query: string;
    switch (this.credentials.odbcOptions.dbms) {
      case "InterSystems Caché/IRIS":
        query = `SELECT TOP ${opt.limit} * FROM ${table.schema}.${table.label}`;
        break;
      case "Microsoft SQL Server":
        query = `SELECT TOP ${
          opt.limit
        } * FROM ${sqlServerQueries.escapeTableName({
          database: table.database,
          schema: table.schema,
          label: table.label,
        })}`;
        break;
      case "IBM Informix":
        query = `SELECT * FROM ${table.database}:${table.label} LIMIT ${opt.limit}`;
        break;
      case "Oracle":
        // Mixed case makes table names case-sensitive
        const mixedCaseRegex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
        const invalidChars = /[&@*$|%~\-]/;
        if (
          mixedCaseRegex.test(table.label) ||
          invalidChars.test(table.label)
        ) {
          query = `SELECT * FROM "${table.label}" WHERE ROWNUM <= ${opt.limit}`;
        } else {
          query = `SELECT * FROM ${table.label} WHERE ROWNUM <= ${opt.limit}`;
        }
        break;
    }

    const getFromClause = (fromClauseOption: string): string => {
      switch (fromClauseOption) {
        case "db.schema.table":
          return `${table.database}.${table.schema}.${table.label}`;
        case "db.table":
          return `${table.database}.${table.label}`;
        case "schema.table":
          return `${table.schema}.${table.label}`;
        case "db:schema.table":
          return `${table.database}:${table.schema}.${table.label}`;
        case "db:table":
          return `${table.database}:${table.label}`;
        case "table":
          return `${table.label}`;
      }
    };

    const limit = opt.limit;
    const fromClause = getFromClause(this.credentials.odbcOptions.fromClause);

    switch (this.credentials.odbcOptions.showTblRecords) {
      case "TOP":
        query = `SELECT TOP ${limit} * FROM ${fromClause}`;
        break;
      case "LIMIT":
        query = `SELECT * FROM ${fromClause} LIMIT ${limit}`;
        break;
      default:
        break;
    }

    const queryResults = await this.query(query, opt, conn);
    return queryResults;
  }

  public async query(
    query: string,
    opt: IQueryOptions = {},
    conn?: odbc.Connection
  ): Promise<NSDatabase.IResult[]> {
    const connection = conn || (await this.connection);

    try {
      const queryResults = await this.executeQuery(connection, query);

      const cols = queryResults.length > 0 ? Object.keys(queryResults[0]) : [];

      return [
        <NSDatabase.IResult>{
          requestId: opt.requestId,
          resultId: generateId(),
          connId: this.getId(),
          cols,
          messages: [
            {
              date: new Date(),
              message: `Query ok with ${queryResults.length} results`,
            },
          ],
          query,
          results: queryResults,
        },
      ];
    } catch (error) {
      console.error(error);

      let rawMessage = (error as any).odbcErrors[0].message || error + "";
      const error_msg_regex = /\[%msg:\s*<([^>]+)>\]/;
      const match = rawMessage.match(error_msg_regex);
      if (match) {
        rawMessage = match[1].trim();
      }

      return [
        <NSDatabase.IResult>{
          requestId: opt.requestId,
          connId: this.getId(),
          resultId: generateId(),
          cols: [],
          messages: [rawMessage],
          error: true,
          rawError: error.odbcErrors,
          query,
          results: [],
        },
      ];
    }
  }

  private async executeQuery(
    conn: odbc.Connection,
    query: string
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      conn.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  public checkDBAccess(database: string) {
    return new Promise((resolve) => {
      this.query(
        `SELECT TOP 1 1 FROM ${database}.INFORMATION_SCHEMA.TABLES`,
        {}
      ).then((result) => {
        if (result[0].error) {
          // https://learn.microsoft.com/en-us/sql/relational-databases/errors-events/mssqlserver-916-database-engine-error?view=sql-server-ver16
          if (result[0].rawError[0].code.toString() === "916") {
            resolve(false);
          }
        } else {
          resolve(true);
        }
      });
    });
  }

  public async findAccessibleDatabases(databases: NSDatabase.IDatabase[]) {
    const accessibleDatabases = [];

    for (const db of databases) {
      if (db.type === ContextValue.DATABASE) {
        // Wait for the previous database access check to complete before moving to the next one
        const access = await this.checkDBAccess(db.database);

        if (access) {
          accessibleDatabases.push(db);
        }
      }
    }

    return accessibleDatabases;
  }

  public async getChildrenForItem({
    item,
    parent,
  }: Arg0<IConnectionDriver["getChildrenForItem"]>) {
    switch (this.credentials.odbcOptions.dbms) {
      case "InterSystems Caché/IRIS":
        return handleCache(item, parent, this);
      case "Microsoft SQL Server":
        return handleSqlServer(item, parent, this);
      case "IBM Informix":
        return handleInformix(item, parent, this);
      case "Oracle":
        return handleOracle(item, parent, this);
      case "db.schema.table":
        return handleDbSchemaTable(item, parent, this);
      case "schema.table":
        return handleSchemaTable(item, parent, this);
    }
    return [];
  }

  private async getColumns(
    parent: NSDatabase.ITable
  ): Promise<NSDatabase.IColumn[]> {
    switch (this.credentials.odbcOptions.dbms) {
      case "Microsoft SQL Server":
        const results = await this.queryResults(this.queries.fetchColumns(parent));
        return results.map((col) => ({
          ...col,
          iconName: col.isPk ? "pk" : col.isFk ? "fk" : null,
          childType: ContextValue.NO_CHILD,
          table: parent,
        }));
      default:
        const connection = await this.open();
        const result = await connection.columns(
          parent.database || null,
          parent.schema || null,
          parent.label,
          null
        );
        const keysFuncInput = Array.from(
          new Set(
            result.map(
              (item) => `${item.TABLE_CAT},${item.TABLE_SCHEM},${item.TABLE_NAME}`
            )
          )
        ).map((combined) => {
          const [TABLE_CAT, TABLE_SCHEM, TABLE_NAME] = combined.split(",");

          return {
            TABLE_CAT: TABLE_CAT === "" ? null : TABLE_CAT,
            TABLE_SCHEM: TABLE_SCHEM === "" ? null : TABLE_SCHEM,
            TABLE_NAME: TABLE_NAME === "" ? null : TABLE_NAME,
          };
        });

        const primaryKeyResult = await connection.primaryKeys(
          keysFuncInput[0].TABLE_CAT,
          keysFuncInput[0].TABLE_SCHEM,
          keysFuncInput[0].TABLE_NAME
        );
        const foreignKeyResult_pkTable = await connection.foreignKeys(
          keysFuncInput[0].TABLE_CAT,
          keysFuncInput[0].TABLE_SCHEM,
          keysFuncInput[0].TABLE_NAME,
          null,
          null,
          null
        );
        const foreignKeyResult_fkTable = await connection.foreignKeys(
          null,
          null,
          null,
          keysFuncInput[0].TABLE_CAT,
          keysFuncInput[0].TABLE_SCHEM,
          keysFuncInput[0].TABLE_NAME
        );

        const pkNames = primaryKeyResult.map((item) => item.COLUMN_NAME);
        const pkList = Array.from(new Set(pkNames));

        const fkNames_pkTable = foreignKeyResult_pkTable.map(
          (item) => item.FKCOLUMN_NAME
        );
        const fkNames_fkTable = foreignKeyResult_fkTable.map(
          (item) => item.FKCOLUMN_NAME
        );
        const fkList = Array.from(
          new Set([...fkNames_pkTable, ...fkNames_fkTable])
        );
        const fkListFiltered = fkList.filter((entry) => !pkList.includes(entry));

        const transformedResult = result.map((entry) => {
          const detail =
            entry.PRECISION > 0
              ? `${entry.TYPE_NAME}(${entry.PRECISION})`
              : entry.TYPE_NAME;

          const isPk = pkList.includes(entry.COLUMN_NAME) ? 1 : 0;
          const isFk = fkListFiltered.includes(entry.COLUMN_NAME) ? 1 : 0;

          // Set iconName based on isPk and isFk
          const iconName = isPk ? "pk" : isFk ? "fk" : null;

          return {
            label: entry.COLUMN_NAME,
            type: ContextValue.COLUMN,
            table: entry.TABLE_NAME,
            dataType: entry.DATA_TYPE,
            detail: detail.toUpperCase(),
            size: entry.PRECISION,
            schema: entry.TABLE_OWNER,
            isNullable: entry.NULLABLE,
            isPk: isPk,
            isFk: isFk,
            iconName: iconName,
            childType: ContextValue.NO_CHILD,
          };
        });
        return transformedResult;
      }
  }

  public async searchItems(
    itemType: ContextValue,
    search: string,
    extraParams: any = {}
  ) {
    switch (itemType) {
      case ContextValue.DATABASE:
        return this.queryResults(this.queries.searchDatabases({ search }));
      case ContextValue.TABLE:
      case ContextValue.VIEW:
        return this.queryResults(
          this.queries.searchTables({ search, ...extraParams })
        );
      case ContextValue.COLUMN:
        return this.queryResults(
          this.queries.searchColumns({ search, ...extraParams })
        );
    }
  }

  public getStaticCompletions = async () => {
    switch (this.credentials.odbcOptions.dbms) {
      case "InterSystems Caché/IRIS":
        return cacheKeywordsCompletion;
      case "Microsoft SQL Server":
        return sqlserverKeywordsCompletion;
      case "IBM Informix":
        return informixKeywordsCompletion;
      case "Oracle":
        return oracleKeywordsCompletion;
      default:
        return sqlserverKeywordsCompletion;
    }
  };
}
