# Pathan Steel — Static Luxury Catalogue

Ek single-page premium catalogue website. **Koi database nahi, koi API nahi, koi access code nahi.**
Sirf HTML + CSS + JavaScript — GitHub Pages, Netlify ya kisi bhi jagah free me chalti hai.

---

## 📁 Folder structure

```
pathan-steel-static/
├── index.html              # poori website (ek hi page)
├── css/
│   └── style.css           # design / theme
├── js/
│   ├── products.js         # ⭐ SIRF YE FILE EDIT KARNI HAI
│   └── main.js             # site ka behaviour (mat chhedo)
└── images/
    ├── logo.svg            # apne logo se replace karo
    └── products/           # yahan apni product photos daalo
```

---

## ▶️ Website kaise kholein (local)

`index.html` par **double-click** karo — bas, browser me khul jayegi.
(Koi `npm install`, koi server, kuch nahi chahiye.)

---

## ➕ Naya product kaise add karein

**Step 1 —** Apni photos `images/products/` folder me copy karo.
File ke naam me space mat rakho: `gate-01.jpg` ✅ · `gate 01.jpg` ❌

**Step 2 —** `js/products.js` file kholo (Notepad ya VS Code me) aur `PRODUCTS` list me naya block add karo:

```js
,{
  name: "Designer Main Gate",
  category: "Gates",
  description: "Powder coated black finish, custom size.",
  images: [
    "images/products/gate-01.jpg",
    "images/products/gate-02.jpg"
  ]
}
```

⚠️ Dhyan rakhein: pichhle product ke **band brace `}` ke baad comma `,`** lagana zaroori hai.

**Step 3 —** File save karo → browser me `Ctrl + Shift + R` (hard refresh). Product turant dikhega.

### Company details badalna
`js/products.js` me sabse upar `COMPANY` block hai — wahan phone, WhatsApp number aur address daal do.
WhatsApp number aise likhein: `919876543210` (91 + 10 digit, koi `+` ya space nahi).

### Category badalna
Usi file me `CATEGORIES` list hai — jo chahiye add/remove kar do. Jis category me koi product nahi hoga wo filter me apne aap chhup jayegi.

### Logo badalna
`images/logo.svg` ko apne logo se replace kar do.
Agar aapka logo PNG hai to use `images/` me `logo.png` naam se daalein, fir `index.html` me `logo.svg` ko `logo.png` se replace karein (4 jagah hai — Ctrl+H se ek saath ho jayega).

---

## 🚀 GitHub Pages par free me live karna

1. [github.com](https://github.com) par account banao → **New repository** → naam do jaise `pathan-steel` → **Public** rakho → Create.
2. Repo page par **"uploading an existing file"** link par click karo.
3. Is folder ke **saare files aur folders** drag-and-drop kar do (index.html, css, js, images) → **Commit changes**.
4. Repo me **Settings** → left side **Pages** → *Branch* me `main` aur folder `/ (root)` select karke **Save**.
5. 1-2 minute me aapki site live: `https://aapka-username.github.io/pathan-steel/`

Baad me koi product add karna ho to sirf `js/products.js` aur nayi photos upload/update kar dena — site apne aap update ho jayegi.

> **Tip:** Naye product ki photos upload karne ke liye GitHub par `images/products` folder kholo → **Add file → Upload files**.

---

## 🎨 Design me kya-kya hai

- Obsidian black + champagne gold luxury theme, brushed-steel texture aur film grain
- Cormorant Garamond (display) + Jost (body) — premium typography
- Preloader, sticky nav, scroll-reveal animations, running marquee
- Category filter pills + responsive product grid with hover zoom
- Full-screen lightbox gallery: arrows, keyboard (← → Esc), mobile swipe, watermark overlay
- Mobile-first responsive, `prefers-reduced-motion` support

## 🔒 Image protection (halka level)

Right-click aur drag-to-save images par band hai, aur lightbox me "PATHAN STEEL" watermark overlay aata hai.
Ye casual copying rokta hai — lekin static site me images public URL par hoti hain, isliye jo technically jaanta ho wo download kar sakta hai. Poori privacy chahiye ho to pehle wala Next.js + access-code wala version use karna hoga.

## 💡 Photos ke liye tips

- Har product ki 2–5 photos best rehti hain
- Upload se pehle images ko thoda compress kar lein (jaise [squoosh.app](https://squoosh.app) par) — site fast khulegi. Har photo 300–800 KB ideal hai.
- Landscape (chaudi) photos grid me sabse achhi lagti hain
