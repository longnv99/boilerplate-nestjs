# NestJS Boilerplate for Production Projects

A boilerplate project built with NestJS, providing a solid and well-structured foundation for developing robust and scalable backend applications. This project comes with built-in best practices for architecture, security, and workflow.

![NestJS Logo](https://nestjs.com/img/logo-small.svg)

## ✨ Key Features

- **Solid Foundation:** [NestJS v11](https://nestjs.com/) on [Node.js v22](https://nodejs.org/).
- **Database:** Integrated with [Mongoose](https://mongoosejs.com/) for working with MongoDB.
- **Professional Architecture:** Implements the **Repository Pattern** and **Generic Pattern** for clean separation of concerns and easy maintenance.
- **Authentication & Authorization:**
  - Authentication using **JWT** (Access Token & Refresh Token).
  - Utilizes **Passport.js** with `local` and `jwt` strategies.
  - Securely hashes passwords and Refresh Tokens with **Argon2**.
  - Role-based authorization with custom Guards.
- **Security:**
  - Endpoints protected by **Global Guards**.
  - **CSRF** (Cross-Site Request Forgery) protection.
  - **XSS** (Cross-Site Scripting) protection with **Helmet** and Content Security Policy (CSP).
  - API Rate Limiting with **Throttler**.
- **Background Jobs & Caching:**
  - Uses **BullMQ** and **Redis** for handling background jobs.
  - Integrated **Cache Manager** with Redis to optimize API performance.
  - Automatic cache updates using **Scheduled Tasks (Cron Jobs)**.
- **Workflow:**
  - **Docker & Docker Compose** for a consistent development environment.
  - Integrated **Husky**, **Lint-Staged**, and **Commitlint** to ensure code quality and standardized commit messages.
  - Automatic API documentation with **Swagger (OpenAPI)**.
  - **CI/CD** integration with **GitHub Actions**.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 22.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/products/docker-desktop/) (Optional, if you want to run with Docker)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Create environment files:**
    Create a `.env.development` file from the example. This file will be used for both Docker and local development.

    ```bash
    cp .env.example .env.development
    ```

    Then, open the newly created `.env.development` file and fill in the required values.

3.  **Install dependencies:**
    ```bash
    npm install
    ```

---

## 🏃 Running the Application

You can choose one of the following three ways to run the application.

### 1. Development Mode with Docker (Recommended)

This method starts the entire system (NestJS, MongoDB, Redis) inside Docker containers, ensuring a consistent environment.

```bash
# Start and build (if necessary)
npm run docker:dev:up

# Stop and clean up
npm run docker:dev:down
```

- The application will be running at `http://localhost:<PORT>` (the port is defined in `.env.development`).
- Supports hot-reloading when you change the source code.

### 2. Fully Local Mode (Without Docker)

This approach is suitable if you don't want to install Docker. You will need to install MongoDB and Redis manually on your machine.

**Step 1: Install and run MongoDB & Redis on your machine.**

- Ensure MongoDB is running on port `27017` and Redis is running on port `6379` (or reconfigure them in `.env.development`).

**Step 2: Update the `.env.development` file**

- Make sure the `DATABASE_HOST` and `REDIS_HOST` variables are set to `localhost`.

**Step 3: Run the application**

```bash
# Run the app in development mode with hot-reload
npm run start:dev
```

- The application will be running at `http://localhost:<PORT>` (the port is defined in `.env.development`).

### 3. Local Debug Mode (Hybrid)

This method runs the NestJS application on your host machine but connects to MongoDB and Redis running inside Docker containers. This is very useful for debugging with VS Code.

**Step 1: Start background services in Docker**

```bash
# Start only MongoDB and Redis
docker-compose -f docker-compose.dev.yml up -d app_mongodb_dev redis_dev
```

**Step 2: Run the application in debug mode**

```bash
npm run start:debug
```

- The application will be running at `http://localhost:<PORT>` (the port is defined in your `.env.debug` file).

---

## 📚 API Documentation (Swagger)

After starting the application, navigate to the following URL to view the interactive API documentation:

`http://localhost:<PORT>/swagger`

This documentation page is protected by Basic Auth. Please use the `SWAGGER_USERNAME` and `SWAGGER_PASSWORD` defined in your `.env` file to log in.

---

## 🚢 Deploying to Production with Render

This project is designed for easy deployment to PaaS platforms like Render.

### Deployment Architecture

- **NestJS Application:** Deployed on **Render** (as a Docker-based Web Service).
- **MongoDB Database:** Uses an external service like **MongoDB Atlas** (which has a generous free tier).
- **Redis:** Uses a managed **Redis service from Render** (which also has a free tier).

### Deployment Steps

1.  **Create a Web Service on Render:**
    - Connect your GitHub account and select this repository.
    - Choose **Docker** as the environment. Render will automatically find and use the `Dockerfile`.
    - Select an instance type (e.g., Free tier).

2.  **Create a Database on MongoDB Atlas:**
    - Sign up and create a free cluster.
    - **Configure Network Access (Very Important):**
      - **Step A:** Go to the **Settings** tab of your Web Service on Render, find the **Outbound IP Addresses** section, and copy these IPs.
      - **Step B:** Go back to MongoDB Atlas, navigate to **Network Access**, click **Add IP Address**, and paste the IPs you copied into the allowlist. This is the most secure approach.
    - Get the Connection String (`mongodb+srv://...`).

3.  **Create Redis on Render:**
    - This is the recommended and simplest approach, as services will communicate over Render's secure internal network.
    - On the Render dashboard, click **New +** -> **Key-Value Store (Redis)**. Render provides a Redis-compatible key-value store.
    - Give it a name, select the same region as your Web Service, and choose the Free tier.
    - Render will automatically provide an **Internal Connection URL**.

4.  **Configure Environment Variables on Render:**
    - Go back to your Web Service's dashboard on Render and navigate to the **"Environment"** tab.
    - **`DATABASE_URL`**: Paste the connection string from MongoDB Atlas here.
    - **`REDIS_URL`**: Click **Add Environment Variable**. Set the **Key** to `REDIS_URL`. For the **Value**, Render will allow you to directly select the internal connection URL for the Redis service you just created.
    - **Note:** Ensure your code in `app.module.ts` is configured to read `REDIS_URL` for both BullMQ and CacheManager.

5.  **Enable Auto-Deploy:**
    - In the **"Settings"** tab of your Web Service, ensure **"Auto-Deploy"** is enabled and points to your `main` branch.

Now, every time you push to the `main` branch, GitHub Actions will run your tests, and if they pass, Render will automatically build and deploy the latest version.

---

## 📄 Environment Variables

Please refer to the `.env.development` file for a complete list of required environment variables and their meanings.
