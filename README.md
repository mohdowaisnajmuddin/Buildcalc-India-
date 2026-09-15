🏗️ BuildCalc v2.1 — Construction Cost Estimator for India

🔗 Live demo: https://buildcalc-india.vercel.app/

A construction cost estimator for Indian cities, calibrated against official government Schedule of Rates rather than generic flat-percentage guesses.

✨ What it actually does
🏙️ City-specific rates tied to real Schedule of Rates. Hyderabad (TSSOR — Telangana State Schedule of Rates), Bangalore (KPWD — Karnataka PWD), Mumbai (MAHA PWD), and Delhi NCR (CPWD) each use their respective official base rate per sqft.
🧱 Material grade multipliers backed by real specs. Standard (1.0x — Fe500D steel, OPC 53, 2x2 vitrified tiles, standard UPVC), Premium (1.28x — Fe550D TMT, 4x2 GVT tiles, Kohler/Jaquar fixtures, teak frames), Luxury (1.65x — Italian marble, Toto fixtures, DGU glass).
🌍 Soil strata surcharges with engineering rationale, not arbitrary percentages: Normal Loam/Red Soil (+0%, standard isolated column footings), Hard Rocky/Sandy (+6.5%, pneumatic breaker chiseling), Black Cotton Soil (+14%, bored under-reamed pile foundation), Soft Clay/Alluvial (+8.5%, reinforced continuous raft).
🔑 Google sign-in for account-based access.
🛠️ Tech stack

Next.js · Firebase · Vercel

⚙️ Running locally
git clone https://github.com/yourusername/buildcalc.git
cd buildcalc
npm install
npm run dev
⚠️ Known issues
The app was originally deployed on Netlify and hit a 404 on the estimate calculation call — most likely caused by Next.js API routes being stripped under static export, or a missing redirect/env var for the backend call. Migrated to Vercel, which has native support for Next.js API routes, to resolve this. If you're debugging a similar issue, check: (1) whether next.config has output: 'export', (2) whether the frontend is calling the correct API path, (3) whether required environment variables are set in the hosting dashboard, not just a local .env.
The "ML-calibrated" language in the UI currently describes rate calibration against real Schedule of Rates data, not a trained regression model. If a trained model is added later, this README and any resume claims should be updated to describe the actual training data, features, and evaluation metrics (MAE/RMSE) — don't claim ML without those specifics.
🗺️ Roadmap
 Confirm estimate calculation is fully working post-migration to Vercel
 Rate freshness indicator (last-updated date) in the UI
 If pursued: an actual trained cost-prediction model, with a documented dataset and evaluation metrics, layered on top of the current rate tables
📸 Screenshots
<img width="1468" height="870" alt="image" src="https://github.com/user-attachments/assets/98ba8365-2893-44e6-9c42-adeda42f912a" />





📄 License

[Add a license, e.g. MIT]

