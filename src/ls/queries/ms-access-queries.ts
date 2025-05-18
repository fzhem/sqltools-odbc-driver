import queryFactory from '@sqltools/base-driver/dist/lib/factory';
import { IBaseQueries, ContextValue } from '@sqltools/types';

export const fetchTables: IBaseQueries['fetchTables'] = queryFactory`
SELECT [Name] AS [label]
      , '${ContextValue.TABLE}'    AS [type]
      , '${ContextValue.NO_CHILD}' AS [childType]
FROM    MSysObjects
WHERE  [Name] NOT LIKE 'MSys%'
  AND  [Name] NOT LIKE '~TMP%'
  AND  [Name] NOT LIKE 'Tmp%'
  AND  [Type] = 1
ORDER BY [Name]
;
`;

export const fetchLinkedTables: IBaseQueries['fetchLinkedTables'] = queryFactory`
SELECT [Name] AS [label]
      , 'connection.linkedTable'   AS [type]
      , 'file-symlink-directory'   AS [iconId]
      , '${ContextValue.NO_CHILD}' AS [childType]
FROM    MSysObjects
WHERE  [Name] NOT LIKE 'MSys%'
  AND  [Name] NOT LIKE '~TMP%'
  AND  [Name] NOT LIKE 'Tmp%'
  AND  [Type] = 4
ORDER BY [Name]
;
`;

export const fetchLinkedODBCTables: IBaseQueries['fetchLinkedODBCTables'] = queryFactory`
SELECT [Name] AS [label]
      , 'connection.linkedOdbcTable' AS [type]
      , 'file-symlink-directory'     AS [iconId]
      , '${ContextValue.NO_CHILD}'   AS [childType]
FROM    MSysObjects
WHERE  [Name] NOT LIKE 'MSys%'
  AND  [Name] NOT LIKE '~TMP%'
  AND  [Name] NOT LIKE 'Tmp%'
  AND  [Type] = 5
ORDER BY [Name]
;
`;

export const fetchQueries: IBaseQueries['fetchQueries'] = queryFactory`
SELECT [Name] AS [label]
      , 'connection.query'         AS [type]
      , 'code'                     AS [iconId]
      , '${ContextValue.NO_CHILD}' AS [childType]
FROM    MSysObjects
WHERE  [Name] NOT LIKE 'MSys%'
  AND  [Name] NOT LIKE '~TMP%'
  AND  [Name] NOT LIKE 'Tmp%'
  AND  [Type] = 6
ORDER BY [Name]
;
`;

export const fetchForms: IBaseQueries['fetchForms'] = queryFactory`
SELECT [Name] AS [label]
      , 'connection.form'          AS [type]
      , 'list-flat'                AS [iconId]
      , '${ContextValue.NO_CHILD}' AS [childType]
FROM    MSysObjects
WHERE  [Name] NOT LIKE 'MSys%'
  AND  [Name] NOT LIKE '~TMP%'
  AND  [Name] NOT LIKE 'Tmp%'
  AND  [Type] = -32768
ORDER BY [Name]
;
`;

export const fetchReports: IBaseQueries['fetchReports'] = queryFactory`
SELECT [Name] AS [label]
      , 'connection.report'        AS [type]
      , 'pie-chart'                AS [iconId]
      , '${ContextValue.NO_CHILD}' AS [childType]
FROM    MSysObjects
WHERE  [Name] NOT LIKE 'MSys%'
  AND  [Name] NOT LIKE '~TMP%'
  AND  [Name] NOT LIKE 'Tmp%'
  AND  [Type] = -32764
ORDER BY [Name]
;
`;

export const fetchMacros: IBaseQueries['fetchMacros'] = queryFactory`
SELECT [Name] AS [label]
      , 'connection.macro'         AS [type]
      , 'terminal-powershell'      AS [iconId]
      , '${ContextValue.NO_CHILD}' AS [childType]
FROM    MSysObjects
WHERE  [Name] NOT LIKE 'MSys%'
  AND  [Name] NOT LIKE '~TMP%'
  AND  [Name] NOT LIKE 'Tmp%'
  AND  [Type] = -32761
ORDER BY [Name]
;
`;

export const fetchModules: IBaseQueries['fetchModules'] = queryFactory`
SELECT [Name] AS [label]
      , 'connection.module'        AS [type]
      , 'file-submodule'           AS [iconId]
      , '${ContextValue.NO_CHILD}' AS [childType]
FROM    MSysObjects
WHERE  [Name] NOT LIKE 'MSys%'
  AND  [Name] NOT LIKE '~TMP%'
  AND  [Name] NOT LIKE 'Tmp%'
  AND  [Type] = -32766
ORDER BY [Name]
;
`;

export const fetchOthers: IBaseQueries['fetchOthers'] = queryFactory`
SELECT [Name] AS [label]
      , 'connection.other'         AS [type]
      , 'symbol-misc'              AS [iconId]
      , '${ContextValue.NO_CHILD}' AS [childType]
FROM    MSysObjects
WHERE  [Name] NOT LIKE 'MSys%'
  AND  [Name] NOT LIKE '~TMP%'
  AND  [Name] NOT LIKE 'Tmp%'
  AND  [Type] NOT IN (1, 4, 5, 6, -32768, -32764, -32761, -32766)
ORDER BY [Name]
;
`;