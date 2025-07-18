import { NSDatabase } from "@sqltools/types";
const keywordsArr = [
  "A",
  "ABORT",
  "ABS",
  "ABSOLUTE",
  "ACCESS",
  "ACOS",
  "ACQUIRE",
  "ACTION",
  "ACTIVATE",
  "ADA",
  "ADD",
  "ADDFORM",
  "ADMIN",
  "AFTER",
  "AGGREGATE",
  "ALIAS",
  "ALL",
  "ALLOCATE",
  "ALTER",
  "AN",
  "ANALYZE",
  "AND",
  "ANY",
  "APPEND",
  "ARCHIVE",
  "ARCHIVELOG",
  "ARE",
  "ARRAY",
  "ARRAYLEN",
  "AS",
  "ASC",
  "ASCII",
  "ASIN",
  "ASSERTION",
  "AT",
  "ATAN",
  "AUDIT",
  "AUTHORIZATION",
  "AVG",
  "AVGU",
  "BACKUP",
  "BECOME",
  "BEFORE",
  "BEGIN",
  "BETWEEN",
  "BIGINT",
  "BINARY",
  "BIND",
  "BINDING",
  "BIT",
  "BLOB",
  "BLOCK",
  "BODY",
  "BOOLEAN",
  "BOTH",
  "BREADTH",
  "BREAK",
  "BREAKDISPLAY",
  "BROWSE",
  "BUFFERPOOL",
  "BULK",
  "BY",
  "BYREF",
  "CACHE",
  "CALL",
  "CALLPROC",
  "CANCEL",
  "CAPTURE",
  "CASCADE",
  "CASCADED",
  "CASE",
  "CAST",
  "CATALOG",
  "CCSID",
  "CEILING",
  "CHANGE",
  "CHAR",
  "CHARACTER",
  "CHARTOROWID",
  "CHECK",
  "CLASS",
  "CLOB",
  "CHECKPOINT",
  "CHR",
  "CLEANUP",
  "CLEAR",
  "CLEARROW",
  "CLOSE",
  "CLUSTER",
  "CLUSTERED",
  "COALESCE",
  "COBOL",
  "COLGROUP",
  "COLLATE",
  "COLLATION",
  "COLLECTION",
  "COLUMN",
  "COMMAND",
  "COMMENT",
  "COMMIT",
  "COMPLETION",
  "COMMITTED",
  "COMPILE",
  "COMPLEX",
  "COMPRESS",
  "COMPUTE",
  "CONCAT",
  "CONFIRM",
  "CONNECT",
  "CONNECTION",
  "CONSTRAINT",
  "CONSTRAINTS",
  "CONSTRUCTOR",
  "CONTAINS",
  "CONTAINSTABLE",
  "CONTENTS",
  "CONTINUE",
  "CONTROLFILE",
  "CONTROLROW",
  "CONVERT",
  "COPY",
  "CORRESPONDING",
  "COS",
  "COUNT",
  "COUNTU",
  "CREATE",
  "CROSS",
  "CUBE",
  "CURRENT",
  "CURRENT_DATE",
  "CURRENT_PATH",
  "CURRENT_ROLE",
  "CURRENT_TIME",
  "CURRENT_TIMESTAMP",
  "CURRENT_USER",
  "CURSOR",
  "CVAR",
  "CYCLE",
  "DATA",
  "DATABASE",
  "DATAFILE",
  "DATAHANDLER",
  "DATAPAGES",
  "DATE",
  "DAY",
  "DAYOFMONTH",
  "DAYOFWEEK",
  "DAYOFYEAR",
  "DAYS",
  "DBA",
  "DBCC",
  "DBSPACE",
  "DEALLOCATE",
  "DEC",
  "DECIMAL",
  "DECLARATION",
  "DECLARE",
  "DECODE",
  "DEFAULT",
  "DEFERRABLE",
  "DEFERRED",
  "DEFINE",
  "DEFINITION",
  "DEGREES",
  "DELETE",
  "DEPTH",
  "DEREF",
  "DELETEROW",
  "DENY",
  "DESC",
  "DESCRIBE",
  "DESCRIPTOR",
  "DESTROY",
  "DHTYPE",
  "DESTRUCTOR",
  "DETERMINISTIC",
  "DICTIONARY",
  "DIAGNOSTICS",
  "DIRECT",
  "DISABLE",
  "DISCONNECT",
  "DISK",
  "DISMOUNT",
  "DISPLAY",
  "DISTINCT",
  "DISTRIBUTE",
  "DISTRIBUTED",
  "DO",
  "DOMAIN",
  "DOUBLE",
  "DOWN",
  "DROP",
  "DUMMY",
  "DUMP",
  "DYNAMIC",
  "EACH",
  "EDITPROC",
  "ELSE",
  "ELSEIF",
  "ENABLE",
  "END",
  "ENDDATA",
  "ENDDISPLAY",
  "ENDEXEC",
  "END-EXEC",
  "ENDFORMS",
  "ENDIF",
  "ENDLOOP",
  "EQUALS",
  "ENDSELECT",
  "ENDWHILE",
  "ERASE",
  "ERRLVL",
  "ERROREXIT",
  "ESCAPE",
  "EVENTS",
  "EVERY",
  "EXCEPT",
  "EXCEPTION",
  "EXCEPTIONS",
  "EXCLUDE",
  "EXCLUDING",
  "EXCLUSIVE",
  "EXEC",
  "EXECUTE",
  "EXISTS",
  "EXIT",
  "EXP",
  "EXPLAIN",
  "EXPLICIT",
  "EXTENT",
  "EXTERNAL",
  "EXTERNALLY",
  "EXTRACT",
  "FALSE",
  "FETCH",
  "FIELD",
  "FIELDPROC",
  "FILE",
  "FILLFACTOR",
  "FINALIZE",
  "FINALIZE",
  "FIRST",
  "FLOAT",
  "FLOOR",
  "FLOPPY",
  "FLUSH",
  "FOR",
  "FORCE",
  "FORMDATA",
  "FORMINIT",
  "FORMS",
  "FORTRAN",
  "FOREIGN",
  "FOUND",
  "FREELIST",
  "FREELISTS",
  "FREETEXT",
  "FREETEXTTABLE",
  "FROM",
  "FREE",
  "FULL",
  "FUNCTION",
  "GENERAL",
  "GET",
  "GETCURRENTCONNECTION",
  "GETFORM",
  "GETOPER",
  "GETROW",
  "GLOBAL",
  "GO",
  "GOTO",
  "GRANT",
  "GRANTED",
  "GRAPHIC",
  "GREATEST",
  "GROUP",
  "GROUPING",
  "GROUPS",
  "HASH",
  "HAVING",
  "HOST",
  "HELP",
  "HELPFILE",
  "HOLDLOCK",
  "HOUR",
  "HOURS",
  "IDENTIFIED",
  "IDENTITY",
  "IGNORE",
  "IDENTITYCOL",
  "IF",
  "IFNULL",
  "IIMESSAGE",
  "IIPRINTF",
  "IMMEDIATE",
  "IMPORT",
  "IN",
  "INCLUDE",
  "INCLUDING",
  "INCREMENT",
  "INDEX",
  "INDEXPAGES",
  "INDICATOR",
  "INITCAP",
  "INITIAL",
  "INITIALIZE",
  "INITIALLY",
  "INITRANS",
  "INITTABLE",
  "INNER",
  "INOUT",
  "INPUT",
  "INSENSITIVE",
  "INSERT",
  "INSERTROW",
  "INSTANCE",
  "INSTR",
  "INT",
  "INTEGER",
  "INTEGRITY",
  "INTERFACE",
  "INTERSECT",
  "INTERVAL",
  "INTO",
  "IS",
  "ISOLATION",
  "ITERATE",
  "JOIN",
  "KEY",
  "KILL",
  "LABEL",
  "LANGUAGE",
  "LARGE",
  "LAST",
  "LATERAL",
  "LAYER",
  "LEADING",
  "LEAST",
  "LEFT",
  "LESS",
  "LENGTH",
  "LEVEL",
  "LIKE",
  "LIMIT",
  "LINENO",
  "LINK",
  "LIST",
  "LISTS",
  "LOAD",
  "LOADTABLE",
  "LOCAL",
  "LOCALTIME",
  "LOCALTIMESTAMP",
  "LOCATOR",
  "LOCATE",
  "LOCK",
  "LOCKSIZE",
  "LOG",
  "LOGFILE",
  "LONG",
  "LONGINT",
  "LOWER",
  "LPAD",
  "LTRIM",
  "LVARBINARY",
  "LVARCHAR",
  "MAIN",
  "MANAGE",
  "MANUAL",
  "MAP",
  "MATCH",
  "MAX",
  "MAXDATAFILES",
  "MAXEXTENTS",
  "MAXINSTANCES",
  "MAXLOGFILES",
  "MAXLOGHISTORY",
  "MAXLOGMEMBERS",
  "MAXTRANS",
  "MAXVALUE",
  "MENUITEM",
  "MESSAGE",
  "MICROSECOND",
  "MICROSECONDS",
  "MIN",
  "MINEXTENTS",
  "MINUS",
  "MINUTE",
  "MODIFIES",
  "MINUTES",
  "MINVALUE",
  "MIRROREXIT",
  "MOD",
  "MODE",
  "MODIFY",
  "MODULE",
  "MONEY",
  "MONTH",
  "MONTHS",
  "MOUNT",
  "MOVE",
  "NAMED",
  "NAMES",
  "NATIONAL",
  "NATURAL",
  "NCHAR",
  "NCLOB",
  "NEW",
  "NEXT",
  "NHEADER",
  "NO",
  "NOARCHIVELOG",
  "NOAUDIT",
  "NOCACHE",
  "NOCHECK",
  "NOCOMPRESS",
  "NOCYCLE",
  "NOECHO",
  "NOMAXVALUE",
  "NOMINVALUE",
  "NONCLUSTERED",
  "NONE",
  "NOORDER",
  "NORESETLOGS",
  "NORMAL",
  "NOSORT",
  "NOT",
  "NOTFOUND",
  "NOTRIM",
  "NOWAIT",
  "NULL",
  "NULLIF",
  "NULLVALUE",
  "NUMBER",
  "NUMERIC",
  "OBJECT",
  "NUMPARTS",
  "NVL",
  "OBID",
  "ODBCINFO",
  "OF",
  "OFF",
  "OFFLINE",
  "OFFSETS",
  "OLD",
  "ON",
  "ONCE",
  "ONLINE",
  "ONLY",
  "OPEN",
  "OPERATION",
  "OPENDATASOURCE",
  "OPENQUERY",
  "OPENROWSET",
  "OPTIMAL",
  "OPTIMIZE",
  "OPTION",
  "OR",
  "ORDER",
  "ORDINALITY",
  "OUT",
  "OUTER",
  "OUTPUT",
  "OVER",
  "OVERLAPS",
  "OWN",
  "PACKAGE",
  "PAD",
  "PARAMETER",
  "PARAMETERS",
  "PAGE",
  "PAGES",
  "PARALLEL",
  "PART",
  "PARTIAL",
  "PATH",
  "POSTFIX",
  "PASCAL",
  "PCTFREE",
  "PCTINCREASE",
  "PCTINDEX",
  "PCTUSED",
  "PERCENT",
  "PERM",
  "PERMANENT",
  "PERMIT",
  "PI",
  "PIPE",
  "PLAN",
  "PLI",
  "POSITION",
  "POWER",
  "PRECISION",
  "PREFIX",
  "PREORDER",
  "PREPARE",
  "PRESERVE",
  "PRIMARY",
  "PRINT",
  "PRINTSCREEN",
  "PRIOR",
  "PRIQTY",
  "PRIVATE",
  "PRIVILEGES",
  "PROC",
  "PROCEDURE",
  "PROCESSEXIT",
  "PROFILE",
  "PROGRAM",
  "PROMPT",
  "PUBLIC",
  "PUTFORM",
  "PUTOPER",
  "PUTROW",
  "QUALIFICATION",
  "QUARTER",
  "QUOTA",
  "RADIANS",
  "RAISE",
  "RAISERROR",
  "RAND",
  "RANGE",
  "RAW",
  "READ",
  "READS",
  "READTEXT",
  "REAL",
  "RECURSIVE",
  "REF",
  "RECONFIGURE",
  "RECORD",
  "RECOVER",
  "REDISPLAY",
  "REFERENCES",
  "REFERENCING",
  "RELATIVE",
  "REGISTER",
  "RELEASE",
  "RELOCATE",
  "REMOVE",
  "RENAME",
  "REPEAT",
  "REPEATABLE",
  "REPEATED",
  "REPLACE",
  "REPLICATE",
  "REPLICATION",
  "RESET",
  "RESETLOGS",
  "RESOURCE",
  "RESTORE",
  "RESTRICT",
  "RESULT",
  "RESTRICTED",
  "RESUME",
  "RETRIEVE",
  "RETURN",
  "RETURNS",
  "REUSE",
  "REVOKE",
  "RIGHT",
  "ROLE",
  "ROLES",
  "ROLLBACK",
  "ROLLUP",
  "ROUTINE",
  "ROW",
  "ROWS",
  "ROWCOUNT",
  "ROWGUIDCOL",
  "ROWID",
  "ROWIDTOCHAR",
  "ROWLABEL",
  "ROWNUM",
  "ROWS",
  "RPAD",
  "RRN",
  "RTRIM",
  "RULE",
  "RUN",
  "RUNTIMESTATISTICS",
  "SAVE",
  "SAVEPOINT",
  "SCHEDULE",
  "SCHEMA",
  "SCN",
  "SCREEN",
  "SCROLL",
  "SCOPE",
  "SEARCH",
  "SCROLLDOWN",
  "SCROLLUP",
  "SECOND",
  "SECONDS",
  "SECQTY",
  "SECTION",
  "SEGMENT",
  "SELECT",
  "SEQUENCE",
  "SERIALIZABLE",
  "SERVICE",
  "SESSION",
  "SESSION_USER",
  "SET",
  "SETS",
  "SETUSER",
  "SIN",
  "SIMPLE",
  "SIGN",
  "SHUTDOWN",
  "SHORT",
  "SHARE",
  "SHARED",
  "SETUSER",
  "SIZE",
  "SLEEP",
  "SMALLINT",
  "SNAPSHOT",
  "SOME",
  "SORT",
  "SOUNDEX",
  "SPACE",
  "SPECIFIC",
  "SPECIFICTYPE",
  "SQL",
  "SQLEXCEPTION",
  "SQLBUF",
  "SQLCA",
  "SQLCODE",
  "SQLERROR",
  "SQLSTATE",
  "SQLWARNING",
  "SQRT",
  "START",
  "STATE",
  "STATEMENT",
  "STATIC",
  "STRUCTURE",
  "STATISTICS",
  "STOGROUP",
  "STOP",
  "STORAGE",
  "STORPOOL",
  "SUBMENU",
  "SUBPAGES",
  "SUBSTR",
  "SUBSTRING",
  "SUCCESSFUL",
  "SUFFIX",
  "SUM",
  "SYSTEM_USER",
  "SUMU",
  "SWITCH",
  "SYNONYM",
  "SYSCAT",
  "SYSDATE",
  "SYSFUN",
  "SYSIBM",
  "SYSSTAT",
  "SYSTEM",
  "SYSTIME",
  "SYSTIMESTAMP",
  "TABLE",
  "TABLEDATA",
  "TABLES",
  "TABLESPACE",
  "TAN",
  "TAPE",
  "TEMP",
  "TEMPORARY",
  "TERMINATE",
  "THAN",
  "TEXTSIZE",
  "THEN",
  "THREAD",
  "TIME",
  "TIMEOUT",
  "TIMESTAMP",
  "TIMEZONE_HOUR",
  "TIMEZONE_MINUTE",
  "TINYINT",
  "TO",
  "TOP",
  "TPE",
  "TRACING",
  "TRAILING",
  "TRAN",
  "TRANSACTION",
  "TRANSLATE",
  "TRANSLATION",
  "TREAT",
  "TRIGGER",
  "TRIGGERS",
  "TRIM",
  "TRUE",
  "TRUNCATE",
  "TSEQUAL",
  "TYPE",
  "UID",
  "UNCOMMITTED",
  "UNDER",
  "UNION",
  "UNIQUE",
  "UNKNOWN",
  "UNNEST",
  "UNLIMITED",
  "UNLOADTABLE",
  "UNSIGNED",
  "UNTIL",
  "UP",
  "UPDATE",
  "UPDATETEXT",
  "UPPER",
  "USAGE",
  "USE",
  "USER",
  "USING",
  "UUID",
  "VALIDATE",
  "VALIDPROC",
  "VALIDROW",
  "VALUE",
  "VALUES",
  "VARBINARY",
  "VARCHAR",
  "VARIABLE",
  "VARIABLES",
  "VARYING",
  "VCAT",
  "VERSION",
  "VIEW",
  "VOLUMES",
  "WAITFOR",
  "WEEK",
  "WHEN",
  "WHENEVER",
  "WHERE",
  "WHILE",
  "WITH",
  "WITHOUT",
  "WORK",
  "WRITE",
  "WRITETEXT",
  "YEAR",
  "YEARS",
  "ZONE",
];

const oracleKeywordsCompletion: { [w: string]: NSDatabase.IStaticCompletion } =
  keywordsArr.reduce((agg, word) => {
    agg[word] = {
      label: word,
      detail: word,
      filterText: word,
      sortText:
        (["SELECT", "CREATE", "UPDATE", "DELETE"].includes(word) ? "2:" : "") +
        word,
      documentation: {
        value: `\`\`\`yaml\nWORD: ${word}\n\`\`\``,
        kind: "markdown",
      },
    };
    return agg;
  }, {});

export default oracleKeywordsCompletion;
