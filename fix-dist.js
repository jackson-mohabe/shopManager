const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "dist", "index.html");
let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(/src="\//g, 'src="./');
html = html.replace(/href="\//g, 'href="./');
fs.writeFileSync(indexPath, html);
console.log("Fixed index.html");

const expoDir = path.join(__dirname, "dist", "_expo", "static", "js", "web");
if (fs.existsSync(expoDir)) {
  const files = fs.readdirSync(expoDir);
  files.forEach((file) => {
    if (file.endsWith(".js")) {
      const filePath = path.join(expoDir, file);
      let content = fs.readFileSync(filePath, "utf8");
      content = content.replace(/typeof __dirname/g, '"string"');
      content = content.replace(/__dirname/g, '""');
      fs.writeFileSync(filePath, content);
      console.log("Fixed:", file);
    }
  });
}

console.log("All fixes applied");
