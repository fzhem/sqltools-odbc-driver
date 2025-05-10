import queryFactory from '@sqltools/base-driver/dist/lib/factory';
import { IBaseQueries, ContextValue } from '@sqltools/types';

const fetchTables = (source: string): IBaseQueries['fetchTables'] => queryFactory`
SELECT DISTINCT TABLE_NAME              AS "label"
             ,  '${ContextValue.TABLE}' AS "type"
             ,  OWNER                   AS "schema"
             ,  0                       AS "isview"
      FROM      ${source}
      ORDER BY  TABLE_NAME
`;

export const fetchDbaTables: IBaseQueries['fetchTables'] = fetchTables('dba_tables');
export const fetchAllTables: IBaseQueries['fetchTables'] = fetchTables('all_tables');

export const fetchUserTables: IBaseQueries['fetchUserTables'] = queryFactory`
SELECT DISTINCT TABLE_NAME              AS "label"
             ,  '${ContextValue.TABLE}' AS "type"
             ,  TABLESPACE_NAME         AS "schema"
             ,  0                       AS "isview"
      FROM      user_tables
      ORDER BY  TABLE_NAME
`;


const fetchViews = (source: string): IBaseQueries['fetchTables'] => queryFactory`
SELECT DISTINCT VIEW_NAME               AS "label"
             ,  '${ContextValue.TABLE}' AS "type"
             ,  OWNER                   AS "schema"
             ,  1                       AS "isview"
      FROM      ${source}
      ORDER BY  VIEW_NAME
`;

export const fetchDbaViews: IBaseQueries['fetchTables'] = fetchViews('dba_views');
export const fetchAllViews: IBaseQueries['fetchTables'] = fetchViews('all_views');

export const fetchUserViews: IBaseQueries['fetchUserViews'] = queryFactory`
SELECT DISTINCT VIEW_NAME               AS "label"
             ,  '${ContextValue.TABLE}' AS "type"
             ,  NULL                    AS "schema"
             ,  0                       AS "isview"
      FROM      user_views
      ORDER BY  VIEW_NAME
`;

export const fetchOtherUsers: IBaseQueries['fetchOtherUsers'] =  queryFactory`
SELECT  USERNAME                   AS "label"
      , 'connection.users'         AS "type"
      , 'account'                  AS "iconId"
      , '${ContextValue.NO_CHILD}' AS "childType" 
FROM     ALL_USERS
ORDER BY USERNAME
`;