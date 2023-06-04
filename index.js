import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import bodyParser from 'body-parser'
import dayjs from 'dayjs'
import cors from 'cors'

const app = express();

var jsonParser = bodyParser.json()

const API_KEY = 'AIzaSyCgKhr4o6KXqYrzwl-tqgltHRtIsHcTsJE';

const getRandomInteger = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/api/geocode', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { placeId } = req.query;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
});

app.get('/api/autocomplete', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { input } = req.query;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data)
        res.json(data.predictions.map(x => ({ description: x.description, place_id: x.place_id })))
    else
        res.json(data);
});

app.get('/api/trips/from/:from/to/:to/date/:date', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { from, to, date } = req.params;
    let trips = []
    const userData = fs.readFileSync('./db/users.json');
    const users = JSON.parse(userData);
    const fileName = `./db/trips/${from}_${to}_${date}.json`
    if (fs.existsSync(fileName)) {
        try {
            const tripsData = fs.readFileSync(fileName);
            const tripsDB = JSON.parse(tripsData);
            tripsDB.forEach((x, i) => {
                const user = users.find(u => u.id === x.user)
                if (!user) return
                trips.push({
                    id: x.id,
                    user: user,
                    from: from,
                    fromLocation: x.fromLocation,
                    to: to,
                    toLocation: x.toLocation,
                    date: dayjs(x.date, 'DD-MM-YYYY').add(getRandomInteger(0, 20), 'hour'),
                    price: x.price,
                    duration: x.duration
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
    res.json(trips);
});

app.post('/api/trips', jsonParser, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const trip = req.body;
    const fileName = `./db/trips/${trip.from.place_id}_${trip.to.place_id}_${trip.date.slice(0, 10)}.json`
    let trips = []
    if (fs.existsSync(fileName)) {
        try {
            const tripsData = fs.readFileSync(fileName);
            trips = JSON.parse(tripsData);
        } catch (error) {
            console.log(error)
        }
    }
    trips.push(trip)
    try {
        console.log('trips', trips)
        fs.writeFileSync(fileName, JSON.stringify(trips))
    } catch (error) {
        console.log('e', error)
    }
    res.status(201).json();
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
app.use(cors({
    origin: '*'
}));