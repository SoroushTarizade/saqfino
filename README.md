# 🏠 Saqfino

### Persian Real Estate Platform

**Saqfino** is a modern Persian real estate platform for discovering, buying, renting, and listing properties.

The project is built with **Next.js, React, TypeScript, Tailwind CSS, MongoDB, Cloudinary, and Resend**, with a fully **RTL Persian user interface**.

> This project was built as a portfolio project to demonstrate practical frontend and full-stack development skills through a real-world product.

---

## 🌐 Live Demo

### [View Live Demo →](https://saqfino-psi.vercel.app/)

**Repository:**
[github.com/SoroushTarizade/saqfino](https://github.com/SoroushTarizade/saqfino)

---

## ✨ Features

### 🏠 Property Discovery

* Browse properties for **sale and rent**
* Property detail pages
* Search by:

  * Title
  * City
  * District
* Advanced filtering by:

  * Property type
  * Price
  * Area
  * Bedrooms
  * Construction year
  * District
* Sort properties by:

  * Newest
  * Lowest price
  * Highest price
  * Largest area
  * Smallest area
* Property amenities
* Property location
* Responsive property cards
* Separate buy and rent experiences

### 📝 Property Listing

Authenticated users can:

* Create property listings
* Choose transaction type
* Add property information
* Add amenities
* Upload property images
* Set property location
* Manage their submitted listings

### 🔐 Authentication

Saqfino includes a real server-side authentication system.

* User registration
* Login / logout
* Password hashing with `bcrypt`
* Session-based authentication
* Secure HTTP-only session cookies
* Remember Me functionality
* Email verification
* Password change
* Protected API endpoints
* Authenticated user profile

Session data is stored server-side and session tokens are hashed before being stored in the database.

### 📧 Email Verification

Email verification is implemented using **Resend** and secure verification tokens.

The system includes:

* Random verification tokens
* Hashed token storage
* Token expiration
* Email verification flow
* Verification status validation

### 🖼️ Image Upload

Property images are uploaded and stored using **Cloudinary**.

The upload system includes:

* File type validation
* File size validation
* Multiple property images
* Cloudinary storage
* Secure image URLs
* Default property image fallback

### 🗺️ Property Maps

Property locations are displayed using:

* **Leaflet**
* **React Leaflet**

Each property can contain latitude and longitude information that can be displayed on an interactive map.

### 👤 User Profile

Users have access to a personal profile area where they can:

* View their account
* Manage their properties
* Update account settings
* Change their password
* Manage submitted listings

### 📱 Responsive & RTL Design

The interface is designed specifically for Persian-speaking users.

* Persian language
* Full RTL layout
* Responsive desktop design
* Responsive mobile design
* Persian typography
* Shabnam font
* Consistent design system

---

## 🛠️ Tech Stack

### Frontend

| Technology         | Usage                      |
| ------------------ | -------------------------- |
| **Next.js 16**     | Full-stack React framework |
| **React 19**       | UI development             |
| **TypeScript**     | Type-safe development      |
| **Tailwind CSS 4** | Styling                    |
| **React Icons**    | UI icons                   |
| **Leaflet**        | Interactive maps           |
| **React Leaflet**  | React map integration      |

### Backend

| Technology                 | Usage            |
| -------------------------- | ---------------- |
| **Next.js Route Handlers** | API development  |
| **MongoDB Atlas**          | Database         |
| **Mongoose**               | MongoDB ODM      |
| **bcryptjs**               | Password hashing |
| **Resend**                 | Email delivery   |
| **Cloudinary**             | Image storage    |

### Deployment & Development

* Git
* GitHub
* Vercel
* ESLint
* Turbopack

---

## 🏗️ Architecture

Saqfino uses the **Next.js App Router** and combines frontend UI with server-side API functionality.

```text
┌──────────────────────────────────────┐
│              Frontend                │
│                                      │
│  Next.js + React + TypeScript        │
│  Tailwind CSS + RTL UI               │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│          Next.js Route Handlers       │
│                                      │
│  Authentication                      │
│  Properties                          │
│  Image Upload                        │
│  Contact                             │
└───────────────┬───────────┬──────────┘
                │           │
        ┌───────▼──────┐ ┌──▼───────────┐
        │ MongoDB      │ │ External      │
        │ Atlas        │ │ Services      │
        │              │ │               │
        │ Mongoose     │ │ Cloudinary    │
        │              │ │ Resend        │
        └──────────────┘ └───────────────┘
```

---

## 📂 Project Structure

```text
saqfino/
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
│       │   ├── change-password/
│       │   ├── login/
│       │   ├── logout/
│       │   ├── me/
│       │   ├── register/
│       │   └── verify-email/
│       ├── contact/
│       ├── properties/
│       │   ├── [id]/
│       │   └── my/
│       └── upload/
│
├── components/
│
├── data/
│
├── lib/
│   ├── cloudinary.ts
│   └── mongodb.ts
│
├── models/
│   ├── EmailVerificationToken.ts
│   ├── Property.ts
│   ├── Session.ts
│   └── User.ts
│
├── public/
│   ├── fonts/
│   └── images/
│
├── types/
│
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Authentication Flow

The authentication system follows a server-side session-based approach.

```text
Register
   │
   ▼
Create User
   │
   ├── Hash Password
   │
   ▼
Create Verification Token
   │
   ▼
Send Verification Email
   │
   ▼
Verify Email
   │
   ▼
Login
   │
   ▼
Create Session
   │
   ▼
HTTP-only Cookie
   │
   ▼
Authenticated Requests
```

### Session Security

The application:

* Never stores plain-text passwords
* Hashes passwords using `bcrypt`
* Generates random session tokens
* Stores hashed session tokens
* Uses HTTP-only cookies
* Expires sessions automatically
* Validates the session server-side

---

## 🗃️ Database Models

### User

Stores user account information:

* First name
* Last name
* Email
* Password hash
* Gender
* Avatar
* Email verification status
* Timestamps

### Session

Responsible for authenticated sessions:

* User ID
* Hashed session token
* Expiration time
* Timestamps

### Property

Stores real estate information:

* User
* Title
* Transaction type
* Property type
* Area
* Bedrooms
* Floor
* Total floors
* Construction year
* Sale price
* Deposit
* Rent
* Amenities
* Description
* City
* District
* Latitude
* Longitude
* Images
* Status
* Timestamps

### EmailVerificationToken

Used for secure email verification:

* User ID
* Hashed token
* Expiration time
* Timestamps

---

## 🔌 API

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/auth/verify-email
POST /api/auth/change-password
```

### Properties

```http
GET  /api/properties
POST /api/properties
GET  /api/properties/[id]
GET  /api/properties/my
```

### Image Upload

```http
POST /api/upload
```

### Contact

```http
POST /api/contact
```

---

## 🔎 Property Filtering

The property API supports server-side filtering and sorting.

Examples include:

```text
Transaction Type
        ↓
Property Type
        ↓
District
        ↓
Price Range
        ↓
Area Range
        ↓
Bedrooms
        ↓
Construction Year
        ↓
Sorting
```

This keeps filtering logic on the server and allows the frontend to request only the data required for the current search.

---

## ☁️ Cloudinary Integration

Property images are uploaded through the application API and stored on Cloudinary.

```text
User
 │
 ▼
Property Form
 │
 ▼
Upload API
 │
 ▼
Cloudinary
 │
 ▼
Secure Image URL
 │
 ▼
MongoDB Property Document
```

Only validated Cloudinary URLs are stored with property records.

---

## 📧 Resend Integration

Resend is used for application emails, including email verification.

The application keeps email credentials in environment variables rather than committing them to the repository.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string

RESEND_API_KEY=your_resend_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Never commit `.env.local` or expose API secrets in the repository.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB / MongoDB Atlas account
* Cloudinary account
* Resend account

### 1. Clone

```bash
git clone https://github.com/SoroushTarizade/saqfino.git
```

### 2. Enter the project

```bash
cd saqfino
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env.local
```

and add the required environment variables.

### 5. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏭 Production Build

Create an optimized production build:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

---

## 🎨 Design System

The project follows a custom Persian RTL design system.

### Primary Color

```text
#CB1B1B
```

### Typography

```text
Shabnam
```

### Direction

```text
RTL
```

### Layout

```text
Desktop
1224px main content width

Desktop gutter
24px

Mobile gutter
16px
```

The interface uses consistent spacing, border radius, typography, and color tokens across the application.

---

## 📸 Screenshots

### Homepage

> Add a screenshot of the homepage here.

### Property Listings

> Add a screenshot of the buy/rent listing pages here.

### Property Details

> Add a screenshot of a property detail page here.

### Authentication

> Add screenshots of the login and registration experience here.

### User Dashboard

> Add screenshots of the profile and property management pages here.

---

## 🎯 Project Goals

Saqfino was developed to simulate a real-world product rather than a simple landing page.

The main goals were:

* Build a complete responsive product
* Convert a real UI design into a working application
* Implement real authentication
* Work with a production database
* Build API endpoints
* Handle sessions securely
* Integrate third-party services
* Implement property search and filtering
* Implement image uploads
* Work with maps
* Deploy the application to production
* Debug and resolve production build issues

---

## 🧠 Key Engineering Experience

Through this project, I worked practically with:

* Next.js App Router
* React Server & Client Components
* TypeScript
* REST-style API design
* MongoDB & Mongoose
* Authentication & session management
* Password hashing
* Email verification
* HTTP-only cookies
* File upload handling
* Cloudinary
* Resend
* Leaflet
* Responsive design
* RTL interfaces
* Production builds
* Vercel deployment
* Git & GitHub workflows

---

## 🚀 Deployment

Saqfino is deployed on **Vercel**.

### Live

**https://saqfino-psi.vercel.app/**

### Source Code

**https://github.com/SoroushTarizade/saqfino**

---

## 👨‍💻 Developer

### Soroush Tarizadeh

Frontend Developer focused on building modern, responsive web applications with:

**React · Next.js · TypeScript · Tailwind CSS**

* GitHub: [SoroushTarizade](https://github.com/SoroushTarizade)
* LinkedIn: [Soroush Tarizadeh](https://www.linkedin.com/in/soroush-tarizadeh/)

---

## 📄 License

This project was created for portfolio and educational purposes.
