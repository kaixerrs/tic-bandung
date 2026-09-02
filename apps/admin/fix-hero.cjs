const fs = require("fs");
let p = "src/components/admin/cms/HeroSliderClient.tsx";
let c = fs.readFileSync(p, "utf8");
c = c.replace(/import \{ useState, useTransition, useRef \} from 'react';/, "import { useState, useTransition, useRef, useEffect } from 'react';");
fs.writeFileSync(p, c, "utf8");
console.log("Hero fixed");
