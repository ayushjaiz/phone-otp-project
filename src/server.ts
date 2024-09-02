import express from "express";
import dotenv from "dotenv"
import cors from 'cors'
import bodyParser from 'body-parser';

import authRoutes from "./routes/authRoutes";
import sendOtp from "./services/smsService";

dotenv.config({ path: `${process.cwd()}/.env` });
const app = express();

const port = process.env.APP_PORT || 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.json());

// cors policy
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));

app.get('/', async (req, res) => {
    res.send('Response from server');
})

app.use('/api/auth', authRoutes);

app.listen(port, async () => {
    console.log(`Server running at localhost:${port}`)
});
