const WinReg = require("winreg");
const path = require("path");

const vendorMatchList = [
  { vendor: "IBM Informix", pattern: /informix/i },
  { vendor: "InterSystems Caché/IRIS", pattern: /intersystems|cache|iris/i },
  {
    vendor: "Microsoft SQL Server",
    pattern: /sql server|sqlsrv|msodbcsql|sqlsrvi?/i,
  },
  { vendor: "Oracle", pattern: /oracle|ora/i },
  {
    vendor: "Microsoft Excel",
    pattern: /\bexcel\b.*driver|\.(xls|xlsx)$/i,
  },
];

// Reads Driver DLL path AND DriverId from DSN registry keys
function getDsnDriverInfo(dsnName) {
  return new Promise((resolve, reject) => {
    const paths = [
      { hive: WinReg.HKCU, key: `\\SOFTWARE\\ODBC\\ODBC.INI\\${dsnName}` },
      { hive: WinReg.HKLM, key: `\\SOFTWARE\\ODBC\\ODBC.INI\\${dsnName}` },
      { hive: WinReg.HKLM, key: `\\SOFTWARE\\Wow6432Node\\ODBC\\ODBC.INI\\${dsnName}` },
    ];

    const tryNext = (i) => {
      if (i >= paths.length) return reject(new Error("DSN not found"));

      const reg = new WinReg(paths[i]);
      reg.get("Driver", (errDriver, driverItem) => {
        if (errDriver || !driverItem) return tryNext(i + 1);

        reg.get("DriverId", (errId, idItem) => {
          const driverId = !errId && idItem ? parseInt(idItem.value) : null;
          return resolve({ driverPath: driverItem.value, driverId });
        });
      });
    };

    tryNext(0);
  });
}

// Reads friendly driver name from ODBCINST.INI by matching DLL name
function getDriverNameFromDll(dllPath) {
  return new Promise((resolve, reject) => {
    const reg = new WinReg({
      hive: WinReg.HKLM,
      key: "\\SOFTWARE\\ODBC\\ODBCINST.INI",
    });

    reg.keys((err, keys) => {
      if (err) return reject(err);

      let found = false;
      let remaining = keys.length;

      keys.forEach((k) => {
        k.get("Driver", (err2, item) => {
          if (
            !found &&
            !err2 &&
            item &&
            path.basename(item.value).toLowerCase() === path.basename(dllPath).toLowerCase()
          ) {
            found = true;
            return resolve(k.key.split("\\").pop());
          }

          remaining--;
          if (remaining === 0 && !found) {
            return reject(new Error("Driver name not found"));
          }
        });
      });
    });
  });
}

function matchToVendor(driverName, dllPath, driverId) {
  if (driverId === 25) return "Microsoft Access"; // ONLY ID check for Access

  for (const { vendor, pattern } of vendorMatchList) {
    if (pattern.test(driverName) || pattern.test(dllPath)) {
      return vendor;
    }
  }

  return null;
}

export async function identifyVendor(dsnName) {
  try {
    const { driverPath, driverId } = await getDsnDriverInfo(dsnName);
    const driverName = await getDriverNameFromDll(driverPath);

    const matched = matchToVendor(driverName, driverPath, driverId);

    if (matched) {
      console.log(`✅ DSN "${dsnName}" is using driver from: ${matched}`);
    } else {
      console.log(`❓ DSN "${dsnName}" uses "${driverName}" — unknown vendor 🤷`);
    }
  } catch (err) {
    console.error(`❌ ${err.message}`);
  }
}
