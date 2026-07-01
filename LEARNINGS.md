# Dev Learnings — pokemon-tetris

開發過程遇到的問題與解法紀錄。

---

## 1. Vercel 專案的 Output Directory 設定可能跟實際 build 輸出脫節

**問題**：`vercel --prod` 部署失敗，錯誤訊息「No Output Directory named "pokemon-tetris" found after the Build completed.」，即使 `vite build` 本身成功產出 `dist/`。
**原因**：CLI 自動連結到既有同名 Vercel 專案，該專案的 Output Directory 設定被誤設成 `"pokemon-tetris"`（推測是先前建立專案時把 Root Directory 名稱誤帶入 Output Directory 欄位）。
**解法**：在專案根目錄（此案例為 `pokemon-tetris/` 子資料夾）新增 `vercel.json`，明確指定 `{"outputDirectory": "dist"}` 覆蓋掉專案設定後重新部署即可成功。
