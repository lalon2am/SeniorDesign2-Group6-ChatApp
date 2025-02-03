# CPS 498 Chat App Project

This is a monorepo for our full stack chat app project containing database table information, the frontend code, and the backend code.
The frontend is a ReactJS app which connects to the backend using REST API requets. It's purpose is to provide users the ability to login as a user or create a user, and then create chat sessions with other users or groups of users.
The backend is a Spring Boot app using Spring MVC to host REST API endpoints for the frontend to access, and using JDBC to connect to the database. Spring security will be used to authenticate between endpoints.

### Deployment environments
frontend: 
- dev: https://bubble-chat-frontend-dev.onrender.com  
- prod: https://bubble-chat-frontend.onrender.com    

backend:
- dev: https://cps410chatappbackenddev.onrender.com   // Needs to be set up again
- prod: https://cps410chatappbackend.onrender.com     // Needs to be set up again

### Local
To run the application, visit the frontend and backend folders for instructions on running locally.
