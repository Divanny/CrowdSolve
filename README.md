<p align="center"><img src="https://i.imgur.com/Os0IP5B.png" alt="project-image"></p>

# CrowdSolve

CrowdSolve is an innovative platform designed to connect real-world problems with collaborative solutions. Our mission is to provide a space where businesses, organizations, and individuals can post challenges and receive solution proposals from an active community of problem-solvers.

## 🚀 Key Features

- **Challenge Posting**: Businesses and organizations can create challenges with specific details.
- **Collaborative Participation**: Users can submit solutions, receive feedback, and improve their proposals.
- **Evaluation and Selection**: A fair evaluation process allows the selection of the best solutions for each challenge.
- **Secure Authentication**: JWT-based authentication ensures secure access and authorization.
- **User-Friendly Interface**: An intuitive design built with modern technologies like React and .NET Core.

## 🛠️ Technologies Used

- **Frontend**: React, Tailwind CSS, Shadcn/Radix UI
- **Backend**: .NET Core
- **Database**: SQL Server (Docker)
- **Authentication**: JWT, Google OAuth
- **Notifications**: Sonner
- **API Management**: Axios

## 📦 Installation and Configuration

### Prerequisites

- [Node.js](https://nodejs.org/) (for the frontend)
- [.NET Core SDK](https://dotnet.microsoft.com/download) (for the backend)
- [Docker](https://www.docker.com/) (for the database)

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Divanny/CrowdSolve.git
   cd CrowdSolve
   ```

2. **Configure the Backend**:
   - Create an `appsettings.json` file in the root of the backend project with the following structure:
   ```json
   {
     "Logging": {
       "LogLevel": {
         "Default": "Information",
         "Microsoft.AspNetCore": "Warning"
       }
     },
     "AllowedHosts": "*",
     "ConnectionStrings": {
       "CrowdSolve": "YourConnectionString"
     },
     "Jwt": {
       "Audience": "https://crowdsolve.site/",
       "Issuer": "https://crowdsolve.site/",
       "Key": "YourSecretKey"
     },
     "Google": {
       "ClientId": "YourClientId",
       "ClientSecret": "YourClientSecret"
     },
     "Mailing": {
       "noreply": {
         "Email": "noreply@crowdsolve.site",
         "Password": "YourPassword"
       },
       "support": {
         "Email": "support@crowdsolve.site",
         "Password": "YourPassword"
       }
     }
   }
   ```

3. **Configure the Frontend**:
   - Create a `.env` file in the root of the frontend project with the following structure:
   ```
   VITE_GOOGLE_CLIENT_ID="YourClientId"
   VITE_GOOGLE_CLIENT_SECRET="YourClientSecret"
   ```

4. **Run the Database with Docker**:
   ```bash
   docker pull divanny/crowdsolve-sqlserver
   docker run -d -p 1433:1433 --name crowdsolve-db divanny/crowdsolve-sqlserver
   ```

5. **Start the Backend**:
   ```bash
   cd CrowdSolve.Server
   dotnet restore
   dotnet run
   ```

6. **Start the Frontend**:
   ```bash
   cd CrowdSolve.Client
   npm install
   npm run dev
   ```

## 🧩 Project Structure

### Frontend
- **UI Components**: Built using [Shadcn](https://ui.shadcn.com/) based on [Radix UI](https://www.radix-ui.com/).
- **Styling**: Tailwind CSS for fast and consistent design.
- **Routing**: Managed with React Router.
- **API Calls**: Custom `use-axios` hook for handling requests.

### Backend
- **Authentication**: JWT and Google OAuth.
- **Database**: SQL Server running in Docker.
- **API**: RESTful endpoints for managing challenges, solutions, and users.

## 🚀 Demo ##

[https://crowdsolve.site/](https://crowdsolve.site/)

---

## 📄 Additional Documentation

- [Shadcn Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/en/main)
- [Sonner Documentation](https://sonner.emilkowal.ski/)

---

## 🤝 Contributing

If you'd like to contribute to the project, follow these steps:

1. Fork the repository.
2. Create a feature branch (`feature/descriptive-name`).
3. Make your changes and ensure everything works correctly.
4. Submit a Pull Request to the `develop` branch.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🌐 Links

- [GitHub Repository](https://github.com/Divanny/CrowdSolve)
- [Docker Hub](https://hub.docker.com/repository/docker/divanny/crowdsolve-sqlserver)

---

Thank you for visiting CrowdSolve! If you have any questions or suggestions, feel free to open an issue in the repository.
