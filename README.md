# 🍕 SliceCraft | Full-Stack Pizza Delivery Web Application

SliceCraft is a feature-rich and modern full-stack pizza delivery web application. Through this platform, users can browse pizzas, build custom pizzas with various bases, sauces, cheeses, and vegetables, make secure online payments via Razorpay, and track their order status in real-time. It also includes a powerful Admin Management Portal.

---

## 🚀 Live Demo Links
- **User Login / Home Page:** [SliceCraft User Login](https://slicecraft-backend-9tgt.onrender.com/)
- **Admin Portal Login:** [SliceCraft Admin Login](https://slicecraft-backend-9tgt.onrender.com/admin-login)

---

## 📸 Project Screenshots

### 1. User Login & Authentication
> *Secure user login and registration portal with clean UI.*
> <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/65a0e73d-663a-4680-a9af-5bd21e7c26d6" />


### 2. User Dashboard & Custom Pizza Builder
> *Interactive home catalog and 4-step custom pizza builder wizard.*
> ![User Dashboard]<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9f4f749b-0d45-4828-86b4-1189bfb02b0b" />


### 3. My Orders & Live Tracking
> *Real-time order status tracking progression from kitchen to delivery.*
> ![Order Tracking]<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/eb835fe6-ea62-4dfa-b449-53a73e9fffb1" />


### 4. Admin Management Portal
> *Admin dashboard to manage analytics, pizza pricing, stock, and customer orders.*
> ![Admin Panel]<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/710d7395-f3b6-4431-ba90-1f0e440432f0" />



---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Responsive UI Design
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) for secure session management
- **Payments:** Razorpay Test Payment Gateway Integration
- **Notifications:** Nodemailer & node-cron for automated low-inventory stock alerts (< 20 units)
- **Deployment:** Render.com

---

## ✨ Key Features
1. **Multi-Page Single-Link Architecture:** All frontend pages (`login.html`, `index.html`, `admin.html`, `admin-login.html`) are seamlessly served via the Express backend on a single Render URL.
2. **Silent Auth Guards:** Unauthorized users are silently redirected directly to their respective login pages without any popup alerts.
3. **Custom Pizza Builder:** Users can select their preferred base, sauce, cheese, and veggies while calculating the live price in real-time.
4. **Real-Time Order Tracking:** Visual status progress tracker (`Order Received` ➔ `In Kitchen` ➔ `Out for Delivery` ➔ `Delivered`).
5. **Admin Control Panel:** Live revenue analytics, total orders, customer list, and inventory stock management.
6. **Automated Low-Stock Email Alerts:** An hourly cron job checks inventory levels and sends an email alert to the admin via Nodemailer if any ingredient stock falls below 20 units.

---

## ⚙️ Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/sayyedmusaib91-code/WebDev-Level3-PizzaDelivery.git](https://github.com/sayyedmusaib91-code/WebDev-Level3-PizzaDelivery.git)
