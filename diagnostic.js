require("dotenv").config();

const fs = require("node:fs");

console.log("Telegram Recovery Diagnostic");
console.log("----------------------------");

try {
    require.resolve("telegram");
    console.log("GramJS: installed");
} catch {
    console.log("GramJS: missing");
}

const hasApiId = Boolean(process.env.TG_API_ID);
const hasApiHash = Boolean(process.env.TG_API_HASH);

console.log("API ID available:", hasApiId);
console.log("API Hash available:", hasApiHash);

const report = {
    timestamp: new Date().toISOString(),
    environment: "Node.js",
    nodeVersion: process.version,
    apiCredentialsAvailable: hasApiId && hasApiHash,
    authenticationAttempted: false
};

fs.writeFileSync(
    "diagnostic-report.json",
    JSON.stringify(report, null, 2)
);

console.log("----------------------------");
console.log("Diagnostic completed.");
console.log("No authentication requests sent.");