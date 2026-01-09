# 🏦 RevoBank API

A secure and scalable banking API built with NestJS, Prisma 6, and PostgreSQL for managing users, bank accounts, and trans

## 🚀 Features

- **User Authentication**: JWT-based registration and login
- **User Profile Management**: View and update user profiles
- **Bank Account Management**: Full CRUD operations for bank accounts
- **Transaction Operations**:
- Deposit to account
- Withdraw from account
- Transfer between accounts
- View transaction history
- **Security**:
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- **API Documentation**: Interactive Swagger/OpenAPI docs

## 🛠️ Technologies Used

- **Framework**: NestJS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6
- **Authentication**: JWT, Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Deployment**: Railway

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (Neon)

## 🔧 Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/awxbila/RevoBank-API.git
   cd revobank-api
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit \`.env\` with your configuration:
   \`\`\`env
   DATABASE_URL="postgresql://neondb_owner:your-pasword@ep-purple-feather-xxxxxxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   JWT_SECRET="your-jwt-secret-key-change-this"
   JWT_EXPIRATION="7d"
   PORT=3000
   NODE_ENV="development"
   \`\`\`

4. Run database migrations:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

5. (Optional) Seed the database:
   \`\`\`bash
   npx prisma db seed
   \`\`\`

6. Start the development server:
   \`\`\`bash
   npm run start:dev
   \`\`\`

The API will be available at \`http://localhost:3000\`

## 📚API Documentation

Interactive API documentation is available at:

- **Local**: \`http://localhost:3000/api-docs\`
- **Production**: \`https://revobank-api-production-a9e7.up.railway.app/api-docs`

## 🔐Authentication

Most endpoints require authentication. To access protected routes:

1. Register at \`POST /auth/register\`
2. Login at \`POST /auth/login\` to receive a JWT token
3. Click "Authorize" button in Swagger
4. Enter token in format: \`Bearer YOUR_JWT_TOKEN\`

## 📁 Project Structure

\`\`\`
src/
├── auth/ # Authentication module
├── users/ # User profile management
├── accounts/ # Bank account CRUD operations
├── transactions/ # Transaction operations
├── prisma/ # Prisma service and module
└── main.ts # Application entry point
\`\`\`

## 🧪 Testing

Run tests:
\`\`\`bash

# Unit tests

npm run test

# E2E tests

npm run test:e2e

# Test coverage

npm run test:cov
\`\`\`

## 🚀 Deployment

The application is deployed on Railway:

- **API URL**: https://revobankbila.my.id
- **Swagger Docs**: https://revobankbila.my.id/api-docs

## 📝API Endpoints

### Authentication

- \`POST /auth/register\` - Register new user
- \`POST /auth/login\` - User login

### Users

- \`GET /user/profile\` - Get user profile (Protected)
- \`PATCH /user/profile\` - Update user profile (Protected)

### Accounts

- \`POST /accounts\` - Create bank account (Protected)
- \`GET /accounts\` - List all user accounts (Protected)
- \`GET /accounts/:id\` - Get specific account (Protected)
- \`PATCH /accounts/:id\` - Update account (Protected)
- \`DELETE /accounts/:id\` - Delete account (Protected)

### Transactions

- \`POST /transactions/deposit\` - Deposit to account (Protected)
- \`POST /transactions/withdraw\` - Withdraw from account (Protected)
- \`POST /transactions/transfer\` - Transfer between accounts (Protected)
- \`GET /transactions\` - List user transactions (Protected)
- \`GET /transactions/:id\` - Get transaction details (Protected)

## 👨‍💻 Developer

- **Name**: Nabilah Nur Hazimah
- **Email**: nablahnur54@gmail.com
- **GitHub**: [@awxbila](https://github.com/awxbila)

## 📄 License

This project is licensed under the MIT License.
\`\`\`
