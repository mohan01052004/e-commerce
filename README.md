# 🛒 Bazaar - E-commerce Web Application

Bazaar is a full-stack role-based e-commerce web application where **customers** can browse products, manage carts, place orders, and **sellers** can add and manage their products. The platform includes **authentication, role-based navigation, OTP-based password reset, and Cloudinary image upload.**

---

## 🚀 Features

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access (Customer / Seller)
- Session persistence using LocalStorage
- OTP-based password reset via email (Sendinblue/Brevo)

### 🛍️ Customer Functionality
- Browse all products
- Add/remove items from cart
- Place orders with delivery address and payment type
- View all previous orders

### 🏷️ Seller Functionality
- Add new products with image upload (Cloudinary)
- View their products
- Delete products

### 🌐 General Features
- Responsive UI with **React, Tailwind CSS**
- React Router-based navigation
- React Context API + Reducers for global state management
- Toast notifications for all key user interactions

---

## 🛠️ Tech Stack

| Frontend             | Backend            | Database           | Other Services            |
|----------------------|--------------------|--------------------|---------------------------|
| React                | Node.js            | MongoDB            | Sendinblue (Email API)    |
| React Router         | Express.js         | Mongoose ORM       | Cloudinary (Image Upload) |
| Context API + Reducers | JWT Authentication |                    |                           |
| React Hot Toast      |                    |                    |                           |
