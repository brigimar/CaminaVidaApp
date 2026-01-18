import { MCPClient } from "antigravity-mcp";
import fs from "fs";

const client = new MCPClient("supabase");

// Tablas críticas
const tables = [
    "coord_scorecamina",
    "walk_ledger_links",
    "economic_events",
    "user_badges"
];

async function auditTable(table) {
    try {
        const rows = await client.query(`SELECT * FROM ${table} LIMIT 100`);
        const schema = Object.keys(rows[0] || {}).map(col => ({
            column: col,
            type: typeof rows[0][col]
        }));

        // Validaciones básicas
        const anomalies = rows.filter(row => {
            if (table === "coord_scorecamina") {
                return row.streak_count < 0 || !row.coordinator_id;
            }
            if (table === "walk_ledger_links") {
                return !row.walk_id || !row.user_id;
            }
            if (table === "economic_events") {
                return !row.id || !row.amount;
            }
            if (table === "user_badges") {
                return !row.user_id || !row.badge_type;
            }
            return false;
        });

        return { table, schema, rowCount: rows.length, anomalies };
    } catch (err) {
        return { table, error: err.message };
    }
}

async function main() {
    const report = [];
    for (const table of tables) {
        const result = await auditTable(table);
        report.push(result);
    }

    fs.writeFileSync("fv_audit_report.json", JSON.stringify(report, null, 2));
    console.log("Reporte FV generado: fv_audit_report.json");
}

main();
