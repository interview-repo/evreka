# 🚀 Evreka Users CRM

Modern user management interface built for Evreka's technical assessment with React, TypeScript, and advanced UI components.

## ✨ Features

- **5,000+ Users** with Table/Card view toggle
- **Advanced Filtering** and search functionality
- **Interactive Maps** with Leaflet integration
- **Modal Forms** with validation
- **URL-based state** management
- **LocalStorage** persistence

## 🛠️ Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **TanStack Query/Router** for state & routing
- **Styled Components** + **Tailwind CSS**
- **MSW** for API mocking
- **Leaflet** for maps
- **Zod** for validation

## 📦 Installation

```bash
yarn install
yarn dev
```

## 🚀 Features Overview

### User List Page

- 5,000 fake users with virtualized scrolling
- Table/Card view toggle
- Search, filter by role/status
- Paginated or infinite scroll modes
- 100vh responsive layout

### User Modal

- Add/Edit user forms
- Real-time validation
- Password strength indicator
- Role dropdown, active checkbox

### User Detail Page

- Route: `/users/:userId`
- User info display
- Interactive map with location marker
- Edit functionality

## 📁 Project Structure

```
src/
├── components/    # UI components
├── hooks/         # Custom hooks
├── routes/        # App routing
├── mock/          # MSW setup
├── types/         # TypeScript types
└── utils/         # Utilities
```

## 🎯 Assessment Compliance

✅ All required features implemented:

- React + TypeScript (no `any`)
- Styled Components
- 5,000+ users with Faker.js
- Table/Card views
- Search & filtering
- Pagination modes
- Modal forms
- Leaflet maps
- LocalStorage persistence

## 🚀 Available Scripts

```bash
yarn dev      # Development server
yarn build    # Production build
yarn preview  # Preview build
yarn lint     # Code linting
```

---

Built with ❤️ for Evreka
