# 🛍️ Shopping Centre

College project: user shopping site (bina login ke order) + admin panel (username/password login, order management).

**Stack:** React (Vite) + HTML/CSS/Bootstrap/JS · Node.js + Express · MongoDB (Mongoose)

> **Sirf laptop par chalana hai (bina Firebase ke)?** **`PEHLE-YE-PADHO.txt`** dekho: `START-WINDOWS.bat` double-click karo, bas.
> Neeche ke Firebase/Render steps sirf tab chahiye jab site online daalni ho.

## Features

**Customer side (no login)**
- Men / Women category filter + search
- 28 products: 22 in stock, 6 out of stock (Out of Stock badge, button disabled)
- Cart (localStorage) → simple checkout (name, phone, address) → Cash on Delivery
- Order place hone par stock automatically kam hota hai (stock se zyada order nahi ho sakta)

**Admin side**
- Login: `/admin/login` (username + password)
- Orders: list, filter by status, view details, status change (Pending → Confirmed → Shipped → Delivered / Cancelled), delete
- Cancel karne par stock wapas add ho jata hai
- Products: add / edit / delete, stock update
- Dashboard cards: total orders, pending, revenue, products

## Folder structure

```
shopping-centre/
├── backend/    (Express API + MongoDB)
└── frontend/   (React app + firebase.json)
```

---

## 1) Local par chalana

### MongoDB
Local MongoDB install karo **ya** free MongoDB Atlas cluster (M0) banao aur uski connection string use karo.

### Backend
```bash
cd backend
cp .env.example .env        # Windows: copy .env.example .env
# .env me MONGO_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD set karo
npm install
npm run seed                # 28 products insert karta hai (dobara chalane par reset hota hai)
npm run dev                 # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

- User site: http://localhost:5173
- Admin: http://localhost:5173/admin/login (default `admin` / `admin123` — `.env` me badal lo)

---

## 2) Deploy

> **Zaroori baat:** Firebase Hosting sirf frontend host karta hai. Node.js backend ke liye Firebase Functions chahiye, jo **Blaze (card wala) plan** maangta hai. Isliye free option: **backend → Render (free)**, **database → MongoDB Atlas (free)**, **frontend → Firebase Hosting (free)**.

### Step A — MongoDB Atlas (free)
1. https://cloud.mongodb.com par free M0 cluster banao.
2. Database Access me user + password banao.
3. Network Access me `0.0.0.0/0` allow karo.
4. Connection string copy karo (`mongodb+srv://...`) aur end me database name lagao, jaise `.../shopping_centre`.
5. Local se seed chalane ke liye `backend/.env` me ye string daalo aur `npm run seed` chalao (products Atlas me chale jayenge).

### Step B — Backend on Render (free)
1. Project ko GitHub par push karo.
2. https://render.com → New → Web Service → repo select karo.
3. Settings: **Root Directory** `backend`, **Build Command** `npm install`, **Start Command** `npm start`, Instance type **Free**.
4. Environment variables:
   - `MONGO_URI` = Atlas string
   - `JWT_SECRET` = koi lambi random string
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` = apna admin login
   - `CLIENT_ORIGIN` = `https://YOUR_PROJECT_ID.web.app,https://YOUR_PROJECT_ID.firebaseapp.com` (Firebase step ke baad update kar sakte ho)
5. Deploy ke baad URL milega, jaise `https://shopping-centre-api.onrender.com`.

Note: Render free plan 15 min inactivity ke baad sleep ho jata hai, pehli request 30–60 sec le sakti hai. Demo se pehle ek baar site khol lo.

### Step C — Frontend on Firebase Hosting (CLI)
```bash
npm install -g firebase-tools
firebase login

# Project banao (ID unique honi chahiye, jaise shopping-centre-rahul-2026)
firebase projects:create shopping-centre-YOURNAME --display-name "Shopping Centre"

cd frontend
firebase use --add          # apna project select karo (alias: default)

# Backend URL set karo
echo "VITE_API_URL=https://shopping-centre-api.onrender.com" > .env.production   # apna Render URL

npm install
npm run build
firebase deploy --only hosting
```

Free domain milega: **`https://shopping-centre-YOURNAME.web.app`**
Admin panel: **`https://shopping-centre-YOURNAME.web.app/admin/login`**

Deploy ke baad Render me `CLIENT_ORIGIN` ko isi URL se update karna mat bhulna, warna CORS error aayega.

---

## Notes
- Product images placeholder (picsum) hain. Admin panel me Image URL badal sakte ho.
- Payment sirf Cash on Delivery hai (college project ke liye simple).
- Admin credentials `.env` me hain, repo me kabhi commit mat karo (`.gitignore` me `.env` already hai).
