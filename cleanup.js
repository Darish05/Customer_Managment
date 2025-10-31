const fs = require("fs");
const path =
  "c:\\Users\\ADMIN\\Desktop\\customer-management-app\\frontend\\src\\App.js";
const content = fs.readFileSync(path, "utf8");
const exportStr = "export default App;";
const idx = content.indexOf(exportStr) + exportStr.length;
const clean = content.substring(0, idx);
fs.writeFileSync(path, clean);
console.log("Done! File size:", clean.length);
