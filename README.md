# ☕ Bean Brewer

Fullstack coffee ordering platform built with React + Node.js

Live Demo : https://beanbrew.vercel.app/

## 📌 Overview

Bean Brewer is a fullstack web application for ordering coffee online.  
Users can redeem a rewards by points , get point by purchase products.
Users can browse products, add to cart, and place orders, while admins can manage products and track orders.

This project focuses on real-world features such as authentication, role-based access, and REST API design.

## 🚀 Features

### 👤 User
- Register / Login (JWT Authentication)
- Browse coffee products
- Add to cart & checkout
- View order history

### 🛠 Admin
- Manage products (CRUD)
- Manage rewards (CRUD)
- Create Promo Code (CRU)
- Manage orders
- Dashboard overview

## 🧑‍💻 Tech Stack

**Frontend**
- React + TypeScript
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js + Express
- JWT Authentication
- REST API

**Database**
- PostgreSQL 

**Deployment**
- Frontend: Vercel
- Backend: Render

## 🏗 Architecture

Client (React) → API (Express) → Database

- Frontend communicates with backend via REST API
- Backend handles authentication and business logic
- Database stores users, products, and orders

## 📚 What I Learned

- Building fullstack applications with React and Express
- Designing RESTful APIs
- Implementing authentication with JWT
- Managing state and API calls efficiently
