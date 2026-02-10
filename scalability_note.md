## Scalability & Architecture Note

### 1. Horizontal Scaling & Load Balancing

- **Current State:** The application is Dockerized, allowing us to spin up multiple instances of the backend container behind a load balancer (like Nginx) to distribute traffic.
- **Node.js Clustering:** In a non-containerized environment, I would use the Node.js `cluster` module or PM2 to utilize all CPU cores.

### 2. Database Optimization

- **Indexing:** Essential fields (email, user ID) are indexed to ensure O(log n) read performance.
- **Connection Pooling:** The application utilizes efficient connection pooling to handle concurrent database requests without overhead.

### 3. Caching Strategy (Future Scope)

- **Redis Integration:** To further reduce database load, I would implement Redis to cache:
  - User sessions/JWT blacklists.
  - Frequently accessed public data (e.g., tasks lists).

### 4. Microservices Transition

- As the application grows, the `Auth` and `Task` modules can be decoupled into separate microservices. This would allow independent scaling (e.g., scaling the Task service separately during high traffic) and fault isolation.
