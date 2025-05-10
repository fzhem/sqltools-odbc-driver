import queryFactory from '@sqltools/base-driver/dist/lib/factory';
import { IBaseQueries, ContextValue } from '@sqltools/types';

export const fetchDatabases: IBaseQueries['fetchDatabases'] = queryFactory`
SELECT  TRIM(name)                 AS label
      , TRIM(name)                 AS database
      , '${ContextValue.DATABASE}' AS type
      , 'database'                 AS detail
FROM     sysmaster:sysdatabases
ORDER BY name
`;

const fetchTablesAndViews = (type: ContextValue, tableType = 'T'): IBaseQueries['fetchTables'] => queryFactory`
SELECT   TRIM(t.tabname) AS label
       , '${type}' as type
       , TRIM(t.owner) AS schema
       , '${p => p.database}' AS database
       , CASE WHEN T.tabtype = 'T' THEN 0 ELSE 1 END AS isView
FROM     ${p => p.database ? `${p.database}:systables` : 'systables'} AS t
WHERE    t.tabtype = '${tableType}'
AND      t.tabid >= 100
ORDER BY t.tabname
`;

export const fetchTables: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.TABLE);
export const fetchViews: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.VIEW, 'V');

export const fetchColumns: IBaseQueries['fetchColumns'] = queryFactory`
SELECT    TRIM(c.colname) AS label
        , '${ContextValue.COLUMN}' as type
        , TRIM(t.tabname) AS table
        , CASE 
              WHEN MOD(coltype,256)=0 THEN 'CHAR' 
              WHEN MOD(coltype,256)=1 THEN 'SMALLINT' 
              WHEN MOD(coltype,256)=2 THEN 'INTEGER' 
              WHEN MOD(coltype,256)=3 THEN 'FLOAT' 
              WHEN MOD(coltype,256)=4 THEN 'SMALLFLOAT' 
              WHEN MOD(coltype,256)=5 THEN 'DECIMAL' 
              WHEN MOD(coltype,256)=6 THEN 'SERIAL' 
              WHEN MOD(coltype,256)=7 THEN 'DATE' 
              WHEN MOD(coltype,256)=8 THEN 'MONEY' 
              WHEN MOD(coltype,256)=9 THEN 'NULL' 
              WHEN MOD(coltype,256)=10 THEN 'DATETIME' 
              WHEN MOD(coltype,256)=11 THEN 'BYTE' 
              WHEN MOD(coltype,256)=12 THEN 'TEXT' 
              WHEN MOD(coltype,256)=13 THEN 'VARCHAR' 
              WHEN MOD(coltype,256)=14 THEN 'INTERVAL' 
              WHEN MOD(coltype,256)=15 THEN 'NCHAR' 
              WHEN MOD(coltype,256)=16 THEN 'NVARCHAR' 
              WHEN MOD(coltype,256)=17 THEN 'INT8' 
              WHEN MOD(coltype,256)=18 THEN 'SERIAL8' 
              WHEN MOD(coltype,256)=19 THEN 'SET' 
              WHEN MOD(coltype,256)=20 THEN 'MULTISET' 
              WHEN MOD(coltype,256)=21 THEN 'LIST' 
              WHEN MOD(coltype,256)=22 THEN 'ROW (unnamed)' 
              WHEN MOD(coltype,256)=23 THEN 'COLLECTION' 
              WHEN MOD(coltype,256)=40 THEN 'LVARCHAR fixed-length opaque types' 
              WHEN MOD(coltype,256)=41 THEN 'BLOB, BOOLEAN, CLOB variable-length opaque types' 
              WHEN MOD(coltype,256)=43 THEN 'LVARCHAR (client-side only)' 
              WHEN MOD(coltype,256)=45 THEN 'BOOLEAN' 
              WHEN MOD(coltype,256)=52 THEN 'BIGINT' 
              WHEN MOD(coltype,256)=53 THEN 'BIGSERIAL' 
              WHEN MOD(coltype,256)=2061 THEN 'IDSSECURITYLABEL'
              WHEN MOD(coltype,256)=4118 THEN 'ROW (named)' 
           ELSE TO_CHAR(coltype)
          END AS detail
        , '${p => p.database}' AS database
        , TRIM(t.owner) AS schema
        , BITAND(coltype,256)=256 AS isNullable
  FROM    ${p => p.database ? `${p.database}:systables` : 'systables'} AS t
  JOIN    ${p => p.database ? `${p.database}:syscolumns` : 'syscolumns'} AS c ON t.tabid = c.tabid
 WHERE    t.tabid >= 100
 ORDER BY t.tabname, c.colno
`;