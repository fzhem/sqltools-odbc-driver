import queryFactory from '@sqltools/base-driver/dist/lib/factory';
import { IBaseQueries, ContextValue } from '@sqltools/types';


export const fetchSchemas: IBaseQueries['fetchSchemas'] = queryFactory`
SELECT DISTINCT TABLE_SCHEMA AS label
             ,  TABLE_SCHEMA AS "schema"
             ,  '${ContextValue.SCHEMA}' AS "type"
             ,  'schema' AS "detail"
             ,  'group-by-ref-type' AS iconId
      FROM      INFORMATION_SCHEMA.TABLES
      WHERE     TABLE_TYPE = 'BASE TABLE'
      ORDER BY  TABLE_SCHEMA
`;

export const fetchTables: IBaseQueries['fetchTables'] = queryFactory`
SELECT DISTINCT TABLE_NAME AS label
             ,  '${ContextValue.TABLE}' AS "type"
             ,  TABLE_SCHEMA AS "schema"
      FROM      INFORMATION_SCHEMA.TABLES
      WHERE     TABLE_TYPE = 'BASE TABLE'
      AND       TABLE_SCHEMA = '${p => p.schema}'
      ORDER BY  TABLE_SCHEMA
`;

export const fetchColumns: IBaseQueries['fetchColumns'] = queryFactory`
SELECT     C.COLUMN_NAME AS label
         , '${ContextValue.COLUMN}' as "type"
         , T.TABLE_NAME AS "table"
         , C.DATA_TYPE AS "dataType"
         , UPPER(C.DATA_TYPE || (
                CASE WHEN C.CHARACTER_MAXIMUM_LENGTH > 0 THEN (
                '(' + CONVERT(VARCHAR, C.CHARACTER_MAXIMUM_LENGTH) + ')'
                ) ELSE '' END
            )) AS "detail"
         , C.CHARACTER_MAXIMUM_LENGTH AS size
         , T.TABLE_SCHEMA AS "schema"
         , C.COLUMN_DEFAULT AS "defaultValue"
         , C.IS_NULLABLE AS "isNullable"
         , (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'primary key' THEN 1 ELSE 0 END) as "isPk"
         , (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'foreign key' THEN 1 ELSE 0 END) as "isFk"
FROM       INFORMATION_SCHEMA.TABLES AS T
INNER JOIN INFORMATION_SCHEMA.COLUMNS AS C             ON (C.TABLE_SCHEMA = T.TABLE_SCHEMA)
                                                      AND (C.TABLE_NAME = T.TABLE_NAME)
LEFT JOIN  INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU   ON (C.TABLE_CATALOG = KCU.TABLE_CATALOG
                                                        AND C.TABLE_NAME = KCU.TABLE_NAME
                                                        AND C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
                                                        AND C.COLUMN_NAME = KCU.COLUMN_NAME)
LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC ON (
    TC.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME
    AND TC.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND TC.TABLE_CATALOG = KCU.TABLE_CATALOG
  )
WHERE (T.TABLE_SCHEMA = '${p => p.schema}') AND (T.TABLE_NAME = '${p => p.label}')
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION
`;

export const searchDatabases: IBaseQueries['searchTables'] = queryFactory`
SELECT DISTINCT TABLE_SCHEMA AS label
             ,  TABLE_SCHEMA AS "database"
             ,  TABLE_SCHEMA AS "schema"
             ,  '${ContextValue.SCHEMA}' AS "type"
             ,  'database' AS "detail"
      FROM      INFORMATION_SCHEMA.TABLES
      WHERE     TABLE_TYPE = 'BASE TABLE'
      ${p => p.search ? `AND LOWER(TABLE_SCHEMA) LIKE '%${p.search.toLowerCase()}%'` : ''}
      ORDER BY  TABLE_SCHEMA
`;

export const searchTables: IBaseQueries['searchTables'] = queryFactory`
SELECT DISTINCT TABLE_NAME AS label
             ,  '${ContextValue.TABLE}' AS "type"
             ,  TABLE_SCHEMA AS "schema"
             ,  TABLE_SCHEMA AS "database"
      FROM      INFORMATION_SCHEMA.TABLES
      WHERE     TABLE_TYPE = 'BASE TABLE'
      ${p => p.search ? `AND LOWER(TABLE_NAME) LIKE '%${p.search.toLowerCase()}%'` : ''}
      ORDER BY  TABLE_SCHEMA
`;

export const searchColumns: IBaseQueries['searchColumns'] = queryFactory`
SELECT     C.COLUMN_NAME AS label
         , '${ContextValue.COLUMN}' as "type"
         , T.TABLE_NAME AS "table"
         , C.DATA_TYPE AS "dataType"
         , UPPER(C.DATA_TYPE || (
                CASE WHEN C.CHARACTER_MAXIMUM_LENGTH > 0 THEN (
                '(' + CONVERT(VARCHAR, C.CHARACTER_MAXIMUM_LENGTH) + ')'
                ) ELSE '' END
            )) AS "detail"
         , C.CHARACTER_MAXIMUM_LENGTH AS size
         , T.TABLE_SCHEMA AS "schema"
         , C.COLUMN_DEFAULT AS "defaultValue"
         , C.IS_NULLABLE AS "isNullable"
         , (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'primary key' THEN 1 ELSE 0 END) as "isPk"
         , (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'foreign key' THEN 1 ELSE 0 END) as "isFk"
FROM       INFORMATION_SCHEMA.TABLES AS T
INNER JOIN INFORMATION_SCHEMA.COLUMNS AS C             ON (C.TABLE_SCHEMA = T.TABLE_SCHEMA)
                                                      AND (C.TABLE_NAME = T.TABLE_NAME)
LEFT JOIN  INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU   ON (C.TABLE_CATALOG = KCU.TABLE_CATALOG
                                                        AND C.TABLE_NAME = KCU.TABLE_NAME
                                                        AND C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
                                                        AND C.COLUMN_NAME = KCU.COLUMN_NAME)
LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC ON (
    TC.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME
    AND TC.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND TC.TABLE_CATALOG = KCU.TABLE_CATALOG
  )
WHERE 1=1
${p => p.search ? `AND LOWER(T.TABLE_SCHEMA) LIKE '%${p.tables[0].database.toLowerCase()}%'` : ''}
${p => p.search ? `AND LOWER(T.TABLE_NAME) LIKE '%${p.tables[0].label.toLowerCase()}%'` : ''}
${p => p.search
  ? `AND (
    LOWER(TRIM(T.TABLE_NAME) || '.' || TRIM(C.COLUMN_NAME)) LIKE '%${p.search.toLowerCase()}%'
    OR LOWER(TRIM(C.COLUMN_NAME)) LIKE '%${p.search.toLowerCase()}%'
  )`
  : ''
}
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION
`;