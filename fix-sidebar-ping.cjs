const fs = require("fs");
let p = "apps/admin/src/components/admin/AdminLayoutWrapper.tsx";
let c = fs.readFileSync(p, "utf8");

const oldUseEffect = `  useEffect(() => {
    // Initial ping
    updateLastSeen();
    
    // Ping every 1 minute
    const interval = setInterval(() => {
      updateLastSeen();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [pathname]);`;

const newUseEffect = `  useEffect(() => {
    // Initial ping
    updateLastSeen();
    
    // Ping every 1 minute
    const interval = setInterval(() => {
      updateLastSeen();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []); // Remove pathname dependency so it doesn't ping on every page transition`;

if (c.includes(oldUseEffect)) {
  c = c.replace(oldUseEffect, newUseEffect);
  fs.writeFileSync(p, c, "utf8");
  console.log("Sidebar ping fixed");
} else {
  console.log("Could not find useEffect in AdminLayoutWrapper");
}
