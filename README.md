# SQLTools ODBC Driver
SQLTools driver with ODBC support.
## Features

- **Connect via DSN**  
  Easily establish connections using a Data Source Name (DSN).  
  > 💡 On Windows, you can create a DSN using the **ODBC Data Sources** system application.

- **Auto-Detection of Supported Databases**  
  Automatically detects and applies support for known databases when possible.

- **Database-Specific Side Panels**
  Customized side panel views for:
    - IBM Informix
    - InterSystems Caché/IRIS
    - Microsoft Access
    - Microsoft SQL Server
    - Oracle
- **Generic Side Panels**
  Supports general database structures using:
  - `db.schema.table`
  - `schema.table`

## Notes

- **Oracle**: Requires both **username** and **password**, even if connecting via DSN.
- **SQL Server**: Requires **username**, even when using DSN authentication.
- **MS Access**:
You may encounter a _"no read permission on 'MSysObjects'"_ error when using the side panel:

<p align="center">
  <img src="https://raw.githubusercontent.com/fzhem/sqltools-odbc-driver/refs/heads/main/screenshots/msysobjects-error.jpg" />
</p>

This can be resolved by following this [Stack Overflow answer](https://stackoverflow.com/a/14669641).


## Screenshots
<p align="center">
  <img src="https://raw.githubusercontent.com/fzhem/sqltools-odbc-driver/refs/heads/main/screenshots/connection-assistant.jpg" />
</p>