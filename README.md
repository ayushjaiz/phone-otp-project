# Authentication using NodeJS + PostgreSQL

This project involves phone number verification using NodeJS and PostgreSQL.

The project uses the following technologies:

- NodeJS
- PostgreSQL
- TypeScript
- Prisma ORM
- Twilio    





## Tools Used

##### `VSCode` : Code Editor
##### `Postman` : Application to develop and test API
##### `Beekeeper Studio` : Modern SQL database manager
## Run Locally

To run this project locally, Node and Postgres must be installed in the system.

Clone the project

```bash
  git clone https://github.com/ayushjaiz/phone-otp-project
```

Go to the project directory

```bash
  cd phone-otp-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  tsc
  npm run start
```


## Environment Variables

Add the following environment variables in .env file as prescribed in .env.example file at project root level


```bash
# app configurations
APP_PORT = 

# database configuration
DATABASE_URL = 

# twilio configuration
TWILIO_ACCOUNT_SID = 
TWILIO_AUTH_TOKEN = 
```