import { CosmosClient } from '@azure/cosmos';
import bodyParser from 'body-parser';
import express from 'express';
import { TripEntity } from '../types'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })


const endpoint = process.env.COSMOS_URL
const key = process.env.COSMOS_KEY

if (!endpoint || !key) throw ("Missing cosmosDB variables")

const client = new CosmosClient({ endpoint, key });
const tripsCollection = client.database('hopngo').container('trips')

const router = express.Router();

var jsonParser = bodyParser.json()

router.get('/from/:from/to/:to/date/:date', async (req, res) => {
    const { from, to, date } = req.params;
    let trips = [] as TripEntity[]
    // const userData = fs.readFileSync('./db/users.json');
    // const users = JSON.parse(userData);
    // const fileName = `./db/trips/${from}_${to}_${date}.json`
    // if (fs.existsSync(fileName)) {
    //     try {
    //         const tripsData = fs.readFileSync(fileName);
    //         const tripsDB = JSON.parse(tripsData);
    //         tripsDB.forEach((x, i) => {
    //             const user = users.find(u => u.id === x.user)
    //             if (!user) return
    //             trips.push({
    //                 id: x.id,
    //                 user: user,
    //                 from: from,
    //                 fromLocation: x.fromLocation,
    //                 to: to,
    //                 toLocation: x.toLocation,
    //                 date: dayjs(x.date, 'DD-MM-YYYY').add(getRandomInteger(0, 20), 'hour'),
    //                 price: x.price,
    //                 duration: x.duration
    //             })
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    res.json(trips);
});

router.post('/', jsonParser, async (req, res) => {
    const trip = req.body;
    try {
        console.log(trip)
        const result = await tripsCollection.items.create(trip)
        res.status(201).json(result.item.id);
    } catch (ex) {
        console.log(ex)
        res.status(500).json();
    }
});

router.get('/', async (req, res) => {
    return res.status(200).json();
});

export default router