# SQLTools ODBC Driver
SQLTools driver with ODBC support.
## Features

- **Connect with DSN**: Easily establish connections via DSN (Data Source Name). On windows you can add a data source in `ODBC Data Sources` System application.
- **Database-Specific Side Panels**: 
  - Access customized side panels for the following databases:
    - IBM Informix
    - InterSystems Caché/IRIS
    - Microsoft SQL Server
    - Oracle
- **Generic Side Panels**: Support for generic side panels using formats such as:
  - `db.schema.table`
  - `schema.table`

## Notes

- **Oracle**: A username and password are required, even if a DSN is selected.
- **SQL Server**: A username is required, even when using a DSN.

## Screenshots
![Connection Assistant](https://raw.githubusercontent.com/fzhem/sqltools-odbc-driver/main/screenshots/connection-assistant.jpg)