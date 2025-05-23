# EYEZ - Modern Sunglasses Store

## ✅ Project Structure (`/src/app`, JS only, Full-Stack)

```
eyez/
├── public/                         # Static files (images, favicon, etc.)

├── src/
│   ├── app/
│   │   ├── layout.js               # Root layout
│   │   ├── page.js                 # Home page

│   │   ├── shop/
│   │   │   └── page.js             # Product listing (SSR)

│   │   ├── product/
│   │   │   └── [slug]/page.js      # Product details page

│   │   ├── cart/
│   │   │   └── page.js

│   │   ├── checkout/
│   │   │   └── page.js

│   │   ├── login/
│   │   │   └── page.js

│   │   ├── register/
│   │   │   └── page.js

│   │   ├── about/
│   │   │   └── page.js

│   │   ├── contact/
│   │   │   └── page.js

│   │   ├── terms/
│   │   │   └── page.js

│   │   ├── account/
│   │   │   ├── layout.js
│   │   │   ├── page.js             # Dashboard
│   │   │   ├── orders/page.js
│   │   │   ├── wishlist/page.js
│   │   │   ├── address/page.js
│   │   │   └── info/page.js

│   │   ├── admin/
│   │   │   ├── layout.js
│   │   │   ├── page.js             # Charts here
│   │   │   ├── products/page.js
│   │   │   ├── products/new/page.js
│   │   │   ├── orders/page.js
│   │   │   ├── users/page.js
│   │   │   ├── discounts/page.js
│   │   │   ├── seo/page.js
│   │   │   └── content/page.js

│   │   ├── api/                    # API routes (full-stack backend)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.js
│   │   │   │   ├── register/route.js
│   │   │   │   └── logout/route.js
│   │   │
│   │   │   ├── products/
│   │   │   │   ├── route.js            # GET all, POST new
│   │   │   │   └── [id]/route.js       # GET, PUT, DELETE single product
│   │   │
│   │   │   ├── orders/
│   │   │   │   ├── route.js            # GET, POST orders
│   │   │   │   └── [id]/route.js       # GET, PUT (status)
│   │   │
│   │   │   ├── users/
│   │   │   │   ├── route.js            # Admin: list users
│   │   │   │   └── [id]/route.js       # Get/update user
│   │   │
│   │   │   ├── wishlist/
│   │   │   │   └── route.js            # GET/POST wishlist
│   │   │
│   │   │   ├── address/
│   │   │   │   └── route.js            # GET/POST address
│   │   │
│   │   │   └── analytics/
│   │   │       └── dashboard/route.js  # Chart data for admin

│   ├── components/                 # Shared UI components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   └── ...

│   ├── lib/                        # Helpers & utilities
│   │   ├── auth.js
│   │   ├── db.js
│   │   ├── validation.js
│   │   └── ...

│   ├── styles/                     # Global and modular CSS
│   │   ├── globals.css
│   │   └── ...

│   ├── middleware.js              # Protect routes (auth, admin)
│
├── .env.local                     # Environment variables
├── next.config.mjs
├── package.json
```



First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

