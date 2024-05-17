# Paseto authentication API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is PASETO Auth API build with, Node.js, Express.js, MongoDB, Docker, Redis and more.

## 🚀 Features

### 🔐 User Authentication and Authorization

- User Registration, Login, Logout, Password Reset, verify token, refresh token
- Implementation of PASETO and CSRF for secure and stateless user authentication
- Role-based access control for distinguishing between Admin and User roles

### 👮‍♂️ Admin Management

- CRUD operations for parking zone management
- Granting admin privileges
- Deleting User

### 🛡️ Security

- Implementation of CSRF Tokens
- Defense against Cross-Site Scripting
- Secure HTTP headers and rate limiting to prevent abuse
- Utilization of Helmet to secure Express apps by setting HTTP response headers
- Password hashing

## 💡 Getting Started

### DOCS

When running app visit `/api/v1/docs`

### Prerequisites

- Docker
  [https://docs.docker.com/engine/install/]

- Docker
  [https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/]

- run Docker Machine
- run Redis Server

### Installation Steps

1. **Clone the Repository**

```sh
git clone https://github.com/GiorgiMakharadze/paseto-auth-nodejs-express.git
```

2. Create dotenv file as shown in `.env.example`

```bash
NODE_ENV=dev
PORT=8000
MONGO_PATH=mongodb://localhost:27017/paseto-auth
CSRF_SECRET=safgawskgf29tasignaskgnaskg29ghoiasghnasiogh290THOIH5908HU6afd5229ASGFWGOPK405Y9adsoedihjnosehppkprehj0w43409ja0gj2-tpjpojg03yjf

REDIS_URL=redis://localhost:6379

DEVELOPMENT_EMAIL_RECEIVER=testDevelopment@test.com
PRODUCTION_EMAIL_RECEIVER=testProduction@test.com

#AWS
AWS_ACCESS_KEY_ID=Sfsdf2Dpcx
AWS_SECRET_ACCESS_KEY=asgasgkagjaopgj+stg3423QAafcpdgowpotgkps |
AWS_REGION=us-east-1
```

2. run `docker compose build`
3. run `docker compose up`
4. You can use API
5. The API is now ready for use! Remember, the API employs CSRF protection. First, make a GET request to /csrf-token, then include the received token in the headers of your API calls as x-csrf-token: value. This is crucial as, without the correct token, you are restricted to making only GET requests.
6. If you wan to shut down run `docker compose down`
7. If an issue arises and docker-compose build does not execute successfully, it is recommended to run npm install as an initial step before attempting to run docker-compose build again. This ensures that all the necessary Node.js dependencies are installed, potentially resolving any errors related to missing packages.
