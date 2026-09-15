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

git clone https://github.com/mohdowaisnajmuddin/Buildcalc-India.vercel.app.git

cd buildcalc

npm install

npm run dev

🗺️ Roadmap
 Confirm estimate calculation is fully working post-migration to Vercel
 Rate freshness indicator (last-updated date) in the UI
 If pursued: an actual trained cost-prediction model, with a documented dataset and evaluation metrics, layered on top of the current rate tables

📸 Screenshots
<img width="1468" height="870" alt="image" src="https://github.com/user-attachments/assets/98ba8365-2893-44e6-9c42-adeda42f912a" />





📄 License

MIT License

Copyright (c) 2026 Mohammed Owais Naj Muddin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

