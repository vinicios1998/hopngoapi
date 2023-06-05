import express from 'express';
import cors from 'cors'
import placesRouter from './routes/places'
import tripsRouter from './routes/trips'
import usersRouter from './routes/users'

const app = express();

app.use(express.urlencoded())
app.use(express.json())

app.use('/api/places', placesRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/users', usersRouter);

app.use(cors({
    origin: '*'
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('req', req)
    next();
});

app.listen(8080, () => {
    console.log('Server is running on port 3001');
});








