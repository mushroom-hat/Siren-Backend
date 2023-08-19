### Express
Express is a web application framework for Node.js. It is used to build Siren's API server. `server.js` is the entry point to the server application which starts a server on port 5000 for connections. 


### Setting up the infrastructure

Siren minimally requires the following infrastructure to be available:

- A MongoDB database (for data storage)
- A Redis server (one-time passwords, rate-limiter etc)


After these have been set up, set the environment variables according to the table below, typically in a .env file:

#### Server Environment Variables

|Environment Variable|Required|Description/Value|
|:---:|:---:|:---|
|NODE_ENV|Yes|`production`|
|PORT|No| Port that server listens on, defaults to pot 5000|
|ACCESS_TOKEN_SECRET|Yes| JWT secret used to sign the access token |
|REFRESH_TOKEN_SECRET|Yes| JWT secret used to sign the refresh token|
|DATABASE_URI|Yes| MongoDB connection URI|
|REDIS_HOST |Yes| REDIS connection URI|
|REDIS_PASS |Yes| REDIS connection password|
|REDIS_PORT |No| REDIS connection port|
|AUTH_EMAIL |Yes| Mail email auth|
|AUTH_PASS |Yes| Mail email password|


### Running Locally

```bash
npm run dev
```

### Deploying
Siren uses Elastic Container Service (ECS) to deploy the API server. Containers are fetched from Elastic Container Registry (ECR). 

To deploy:
1) Build Docker image for server
   ```
   $ docker build . siren-api-server
   ```
2) Tag & Upload image to ECR
3) Apply the Terraform Infrastructure [here](https://github.com/mushroom-hat/Siren-Terraform)
4) Add LB domain name as CNAME record in DNS registrar.
   
*Change image name in ecs/task_definitions.tf module if needed *
