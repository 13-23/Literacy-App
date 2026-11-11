// src/shell.html + 문제 데이터를 합쳐 웹 배포본(web/)과 앱용 www/ 를 만든다.  사용: npm run build
// 문제 데이터: src/data.js(TOEIC) + src/data/*.json(JLPT·HSK) + src/vocab/*.json(단어장, 단어 퀴즈)
// json 파일 이름의 앞부분(jlpt-, hsk-, toeic-)이 시험을 정한다.
import { readFileSync, writeFileSync, mkdirSync, cpSync, copyFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = f => readFileSync(join(ROOT, "src", f), "utf8");

const packs = dir => readdirSync(join(ROOT, "src", dir)).filter(f => f.endsWith(".json")).sort()
  .map(f => `["${f.split(/[-.]/)[0]}",${JSON.stringify(JSON.parse(src(join(dir, f))))}]`).join(",\n");
const data = src("data.js") + `\nconst PACKS=[\n${packs("data")}\n];\nconst VOCAB=[\n${packs("vocab")}\n];\n`;
const page = src("shell.html").replace("/*DATA*/", () => data);
let [head, body] = page.split(/<\/style>\n([\s\S]*)/);
head = head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "");
const meta = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="TOEIC RC·JLPT·HSK 단어, 문장, 독해 퀴즈와 단어장. 즉시 채점, 한국어 해설, 오답노트, CSV로 문제 추가.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="어학 완전정복">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
`;
const reset = `:root{color-scheme:light;padding-top:var(--safe-area-inset-top,env(safe-area-inset-top,0px));padding-bottom:var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))}
body{margin:0}
img{max-width:100%}
[hidden]{display:none!important}
`;
head = head.replace("<style>\n", "<style>\n" + reset);
const boot = `<script>
/* 앱(안드로이드·iOS) 안에서는 상태 표시줄 글자색을 테마에 맞추고, 웹에서는 오프라인 캐시를 켠다. */
(function(){
  var cap=window.Capacitor;
  if(cap&&cap.isNativePlatform&&cap.isNativePlatform()){
    var SB=cap.Plugins&&cap.Plugins.SystemBars;
    var sync=function(){if(!SB)return;var dark=document.documentElement.getAttribute("data-theme")==="dark";
      SB.setStyle({style:dark?"DARK":"LIGHT"}).catch(function(){});};
    sync();new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  }else if("serviceWorker" in navigator){
    window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
  }
})();
</script>
`;
const html = `<!doctype html>\n<html lang="ko">\n<head>\n${meta}${head}</style>\n</head>\n<body>\n${body}${boot}</body>\n</html>\n`;

const targets = {
  web: ["manifest.webmanifest", "sw.js", "404.html", "privacy.html", ".nojekyll"],
  www: ["manifest.webmanifest", "privacy.html"],
};
for (const [out, extras] of Object.entries(targets)) {
  const d = join(ROOT, out);
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, "index.html"), html);
  cpSync(join(ROOT, "public", "icons"), join(d, "icons"), { recursive: true });
  for (const f of extras) copyFileSync(join(ROOT, "public", f), join(d, f));
}
console.log(`built web/ and www/ (${Math.round(html.length / 1024)} KB)`);
