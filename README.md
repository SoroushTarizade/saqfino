# 🏠 Saqfino

### سقفی برای همه

**A modern Persian RTL real-estate platform built to turn a property search into a complete digital experience.**

<br />

[🌐 Live Demo](https://saqfino-psi.vercel.app/) · [💻 Source Code](https://github.com/SoroushTarizade/saqfino) · [👨‍💻 Developer](https://soroushtarizadeh.vercel.app/en)

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge\&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge\&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge\&logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge\&logo=mongodb)

---

## ✦ More Than a Real-Estate UI

Saqfino started as a real-estate interface.

It became much more.

Instead of building another collection of static pages and fake interactions, I built Saqfino as a **full-stack product experience** — combining a Persian RTL interface with authentication, database-driven properties, server-side filtering, image management, maps, email verification, user profiles and protected API routes.

The goal was simple:

> **Build something that feels like a real product — not just something that looks like one.**

---

# 🏡 The Product

Saqfino is designed around three core experiences:

### 🔍 Find a place

Users can browse properties and narrow their search using different criteria such as:

* Buy / Rent
* Property type
* City & district
* Price / deposit
* Area
* Bedrooms
* Construction year
* Sorting

The filtering logic is processed on the server and translated into MongoDB queries.

---

### 📍 Explore a property

Every property has its own dedicated experience with:

* Property gallery
* Price information
* Area & bedrooms
* Floor information
* Construction year
* Amenities
* Full description
* Location
* Interactive map

The goal is to give users enough information to evaluate a property before taking the next step.

---

### 📤 Publish a property

Authenticated users can create their own listings.

The submission flow handles:

```text
Property information
        ↓
Validation
        ↓
Authentication check
        ↓
Image upload
        ↓
Cloudinary
        ↓
MongoDB
        ↓
Published property
```

This turns the platform from a simple browsing interface into a two-sided product.

---

# ⚡ What Makes It Interesting?

| Experience            | What happens behind the UI         |
| --------------------- | ---------------------------------- |
| 🔐 Authentication     | Custom server-side session system  |
| 📧 Email Verification | Verification tokens + Resend       |
| 🔑 Password Security  | bcrypt hashing                     |
| 🗄️ Data              | MongoDB + Mongoose                 |
| 🔎 Search             | Server-side query generation       |
| 🎛️ Filters           | Dynamic MongoDB filters            |
| 🖼️ Images            | Cloudinary upload pipeline         |
| 🗺️ Location          | Leaflet + React Leaflet            |
| 👤 User Area          | Protected profile & property pages |
| 📱 Responsive UI      | Desktop / tablet / mobile          |
| 🧭 RTL                | Persian-first architecture         |

---

# 🧠 Under the Hood

Saqfino is built around a clear separation between the interface, server logic, database and external services.

```text
                         ┌──────────────────┐
                         │     SAQFINO      │
                         │   Next.js App    │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        ┌───────────┐       ┌───────────┐       ┌───────────┐
        │   React   │       │   Server  │       │    API    │
        │    UI     │       │   Logic   │       │  Routes   │
        └───────────┘       └─────┬─────┘       └─────┬─────┘
                                  │                   │
                    ┌─────────────┼───────────────────┘
                    │             │
                    ▼             ▼
              ┌──────────┐   ┌──────────┐
              │ MongoDB  │   │Cloudinary│
              │  Atlas   │   │  Images  │
              └──────────┘   └──────────┘
                    │
                    ▼
               ┌─────────┐
               │ Resend  │
               │  Email  │
               └─────────┘
```

---

# 🔐 Authentication

One of the main goals of the project was to avoid fake frontend authentication.

Saqfino implements a real authentication flow.

### Registration

```text
Register
   ↓
Validate input
   ↓
Hash password
   ↓
Create user
   ↓
Generate verification token
   ↓
Send email
```

### Login

```text
Credentials
   ↓
Validate user
   ↓
Compare password
   ↓
Create session
   ↓
Hash session token
   ↓
HTTP-only cookie
```

### Protected requests

```text
Request
  ↓
Session cookie
  ↓
Hash token
  ↓
Find session
  ↓
Validate expiration
  ↓
Find user
  ↓
Check verification
  ↓
Allow / Reject
```

Authentication is therefore handled on the server instead of depending on client-side storage such as `localStorage`.

---

# 🗄️ Data Model

The core product revolves around three major entities:

```text
User
 │
 ├── Sessions
 │
 └── Properties
       │
       ├── Images
       ├── Location
       ├── Pricing
       ├── Amenities
       └── Metadata
```

### User

```text
User
├── firstName
├── lastName
├── email
├── passwordHash
├── gender
├── avatar
├── emailVerified
└── timestamps
```

### Session

```text
Session
├── userId
├── tokenHash
├── expiresAt
└── timestamps
```

### Property

```text
Property
├── userId
├── title
├── transactionType
├── propertyType
├── area
├── bedrooms
├── floor
├── totalFloors
├── yearBuilt
├── salePrice
├── deposit
├── rent
├── amenities
├── description
├── city
├── district
├── latitude
├── longitude
├── images
├── status
└── timestamps
```

---

# 🔎 Search & Filtering

The property search system isn't just a collection of client-side filters.

User-friendly Persian options are converted into server-side MongoDB conditions.

For example:

```text
┌─────────────────────────────┐
│ Apartment                   │
│ 120–150 m²                  │
│ 10–15 Billion               │
│ 3 Bedrooms                  │
│ Newest                      │
└──────────────┬──────────────┘
               ↓
       Server-side parsing
               ↓
       MongoDB query object
               ↓
       Filtered properties
               ↓
        Formatted response
               ↓
          React UI
```

This approach keeps the filtering logic close to the data instead of loading everything into the browser and filtering it locally.

---

# ☁️ Image Upload Architecture

Property images are handled through Cloudinary.

```text
User
 │
 │ Select image
 ▼
Next.js API
 │
 │ Validate type & size
 ▼
Cloudinary
 │
 │ Upload
 ▼
Secure image URL
 │
 ▼
MongoDB Property
```

The database stores the image URLs rather than the actual image files.

The upload system also validates:

* File type
* File size
* Number of images
* Allowed Cloudinary URLs

---

# 🗺️ Location & Maps

Property locations are stored using:

```text
latitude
longitude
```

These coordinates are used to display properties on interactive maps using:

**Leaflet + React Leaflet**

This allows the property detail experience to connect the listing information with its real-world location.

---

# 🎨 Persian-First Design

Saqfino isn't simply an English/LTR interface translated into Persian.

The interface was designed around a Persian RTL experience from the beginning.

### Design system

```text
Direction       RTL
Language        Persian
Font            Shabnam
Primary Color   #CB1B1B
Desktop Grid    12 columns
Desktop Width  1224px
Mobile Gutter   16px
Desktop Gutter  24px
```

The visual language uses the primary red as the product identity while keeping the rest of the interface clean and content-focused.

---

# 📱 Responsive by Design

The interface adapts across:

**Desktop → Tablet → Mobile**

Rather than shrinking the desktop interface, layouts and component behavior are adjusted for smaller screens.

This includes:

* Navigation
* Property cards
* Search controls
* Filters
* Forms
* Images
* Maps
* Profile sections
* Content spacing

---

# 🧩 Project Structure

```text
sagfino/
│
├── app/
│   ├── about/
│   ├── amlak/
│   ├── buy/
│   │   └── [id]/
│   ├── contact/
│   ├── login/
│   ├── moshaverin/
│   ├── news/
│   │   └── [id]/
│   ├── profile/
│   │   ├── ads/
│   │   └── settings/
│   ├── register/
│   ├── rent/
│   │   └── [id]/
│   ├── submit/
│   ├── verify-email/
│   │
│   └── api/
│       ├── auth/
│       ├── contact/
│       ├── properties/
│       └── upload/
│
├── components/
│
├── models/
│   ├── User.ts
│   ├── Session.ts
│   ├── Property.ts
│   └── EmailVerificationToken.ts
│
├── lib/
│   ├── mongodb.ts
│   └── cloudinary.ts
│
├── public/
│   ├── fonts/
│   └── images/
│
└── ...
```

---

# 🛠️ Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* React Icons

### Backend

* Next.js Route Handlers
* MongoDB Atlas
* Mongoose
* bcryptjs
* Server-side sessions

### Services

* Cloudinary
* Resend
* Leaflet

### Deployment

* Vercel

---

# 🔌 API

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/verify-email
POST /api/auth/change-password
```

### Properties

```http
GET  /api/properties
POST /api/properties
GET  /api/properties/[id]
GET  /api/properties/my
```

### Other

```http
POST /api/upload
POST /api/contact
```

---

# 🖼️ Screenshots

## Homepage

> Add a full-width screenshot of the homepage here.

![Saqfino Homepage](./docs/screenshots/home.png)

---

## Property Discovery

> Search, filtering and property cards.

![Property Discovery](./docs/screenshots/properties.png)

---

## Property Details

> Gallery, information and location.

![Property Details](./docs/screenshots/property-details.png)

---

## Authentication

> Login and registration experience.

![Authentication](./docs/screenshots/auth.png)

---

## User Dashboard

> Profile and property management.

![Dashboard](./docs/screenshots/dashboard.png)

---

# 🧪 Engineering Challenges

### 01 — Building Real Authentication

Instead of relying on mock users or browser storage, the project required designing a complete authentication flow with sessions, password hashing and email verification.

### 02 — Connecting Multiple Services

The application communicates with several external services:

```text
Next.js
 ├── MongoDB
 ├── Cloudinary
 └── Resend
```

Each service has a different responsibility and failure mode.

### 03 — Designing Server-side Filters

Persian UI labels needed to be translated into predictable database queries while keeping the API flexible enough for both buying and renting.

### 04 — RTL From the Ground Up

RTL affects much more than text alignment.

Spacing, navigation, icon placement, layouts, forms and responsive behavior all need to be considered differently.

### 05 — Production Deployment

The application was developed with production deployment in mind, including environment variables, database connectivity, third-party services and production builds.

---

# 📈 What I Wanted to Learn

Saqfino was built as a practical exercise in moving from:

```text
"Can I build a frontend?"
```

to:

```text
"Can I build a complete web product?"
```

The project gave me hands-on experience with:

* Full-stack Next.js architecture
* Server-side API design
* MongoDB data modeling
* Mongoose
* Authentication
* Session management
* Password security
* Email verification
* Cloudinary
* Resend
* Maps
* Server-side filtering
* Responsive RTL design
* TypeScript debugging
* Production deployment

---

# 🚀 Running Locally

Clone the project:

```bash
git clone https://github.com/SoroushTarizade/saqfino.git

cd saqfino
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
MONGODB_URI=

RESEND_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 🏗️ Production

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

### Deployment

**Vercel** — Application hosting
**MongoDB Atlas** — Database
**Cloudinary** — Image storage
**Resend** — Transactional email

---

# 🌐 Live Product

### Try Saqfino

**https://saqfino-psi.vercel.app/**

The project is designed to demonstrate a complete real-estate product experience rather than a collection of isolated frontend screens.

---

# 👨‍💻 Built by Soroush Tarizadeh

I'm a **Frontend Developer** focused on building modern, responsive and intuitive web experiences with:

**React · Next.js · TypeScript · Tailwind CSS**

Saqfino is part of my portfolio journey toward building increasingly complete and production-oriented applications.

### More about me

🌐 **Portfolio**
https://soroushtarizadeh.vercel.app/en

💼 **LinkedIn**
https://www.linkedin.com/in/soroush-tarizadeh/

💻 **GitHub**
https://github.com/SoroushTarizade

---

# ⭐ Final Note

Saqfino was built with one principle in mind:

> **Don't just make it work. Make it feel like a real product.**

From the interface and RTL design to authentication, APIs, database architecture, image storage and deployment, every part of the project was an opportunity to move one step closer to real-world frontend engineering.

**Built with Next.js, TypeScript, MongoDB, Cloudinary, Resend — and a lot of debugging.**
