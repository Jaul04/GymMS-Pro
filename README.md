🏋️ GymMS Pro

GymMS Pro is a full-stack Gym Management System built to simplify the management of gym members, trainers, plans, payments, attendance, profiles, and administrative operations.

✨ Features

👤 Member registration and management

🏋️ Trainer management

📋 Membership plan management

💰 Payment management with Razorpay

🧾 PDF payment receipt generation

📷 QR-code based attendance

👨‍💼 Admin profile management

🖼️ Member and trainer profile photos

📊 Dashboard statistics

📧 Membership expiry reminders

📱 Responsive desktop and mobile UI

🔐 Session-based authentication and protected routes

🚫 Duplicate payment prevention

🗄️ MongoDB database integration

🛠️ Technologies Used

Frontend

HTML5

CSS3

JavaScript

Responsive Design

Backend

Node.js

Express.js

Database

MongoDB

Mongoose

APIs / Services

Razorpay

Email service

QR Code functionality

Tools

Git

GitHub

VS Code

MongoDB Compass

Postman

📂 Project Structure

Gym Management System/
├── app.js
├── package.json
├── .gitignore
├── README.md
├── config/
├── controllers/
├── models/
├── routes/
├── public/
│   ├── views/
│   ├── css/
│   ├── js/
│   └── uploads/
├── receipts/
└── ...

⚙️ Installation

1. Clone the repository

git clone https://github.com/Jaul04/GymMS-Pro.git
cd GymMS-Pro

2. Install dependencies

npm install

3. Create .env

Create a .env file in the project root:

MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=8000

Important: Never upload .env or API/payment secrets to GitHub.

4. Start the application

node app.js

For development with Nodemon, if configured:

npm run dev

Open:

http://localhost:8000

💳 Razorpay

GymMS Pro supports online payments through Razorpay.

Required environment variables:

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

Payment signatures are verified before successful online payments are stored.

📷 QR Attendance

The attendance module allows gym members to use unique QR codes.

Flow:

Member QR
   ↓
Camera Scanner
   ↓
Member Verification
   ↓
Active Membership Check
   ↓
Duplicate Attendance Check
   ↓
Attendance Saved

💰 Payment Flow

Member
   ↓
Select Plan
   ↓
Razorpay Payment
   ↓
Payment Verification
   ↓
Save Payment
   ↓
Update Member
   ↓
Generate PDF Receipt

🔐 Security

The application includes:

Session-based authentication

Password protection

Environment variables for secrets

Razorpay signature verification

Duplicate payment prevention

Protected routes

Input validation

.env excluded from Git

📱 Responsive Design

GymMS Pro is designed for:

💻 Desktop

💻 Laptop

📱 Mobile

📟 Tablet

🚀 Deployment

The application can be deployed to Node.js hosting platforms such as Render or Railway.

For production deployment, configure environment variables in the hosting platform rather than committing .env to GitHub.

🔮 Future Enhancements

Advanced analytics and reports

WhatsApp notifications

Trainer attendance

Member mobile application

Subscription auto-renewal

Role-based access control

Cloud image storage

Expense management

Workout and diet tracking

AI-based fitness recommendations

👨‍💻 Developer

Jaul Ansar

GitHub: https://github.com/Jaul04

Repository: https://github.com/Jaul04/GymMS-Pro

📄 License

This project is developed for educational and project purposes.

⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
