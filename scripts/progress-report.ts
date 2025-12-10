import fs from "fs";
import path from "path";

const srcDir = path.resolve("src");
const report: string[] = [];

function scanDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) scanDir(full);
    else if (full.endsWith(".ts") || full.endsWith(".tsx"))
      report.push(full.replace(process.cwd(), "").replace(/\\/g, "/"));
  }
}

scanDir(srcDir);

const summary = {
  totalFiles: report.length,
  aiFiles: report.filter(f => f.includes("/ai/")),
  apiFiles: report.filter(f => f.includes("/api/")),
  sendpulseFiles: report.filter(f => f.includes("/sendpulse/")),
  linkedinFiles: report.filter(f => f.includes("/linkedin/")),
  tests: report.filter(f => f.includes("__tests__/")),
};

fs.writeFileSync("progress.json", JSON.stringify(summary, null, 2));

console.log("✅ Progress report generated → progress.json");
