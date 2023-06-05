import express from 'express';
import cors from 'cors'
import placesRouter from './routes/places'
import tripsRouter from './routes/trips'
import usersRouter from './routes/users'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config({ path: './.env' })

dotenv.config({ path: './.env' })

const secret = process.env.TOKEN_SECRET

const app = express();

app.use(cors({
    origin: '*'
}));

app.use((req, res, next) => {
    console.log(req.url)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((req, res, next) => {
    if (req.url !== '/api/users/login') {
        const token = req.headers['authorization']
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, secret as string, (err: any, user: any) => {
            if (err) {
                console.log(err)
                return res.sendStatus(403)
            }
            req.user = user
        })
    }
    next();
});

app.use(express.urlencoded())
app.use(express.json())

app.use('/api/places', placesRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/users', usersRouter);

app.listen(process.env.API_PORT ?? 8080, () => {
    console.log('Server is running on port ' + process.env.API_PORT ?? 8080);
});








