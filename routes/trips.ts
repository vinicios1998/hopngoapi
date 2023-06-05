import { CosmosClient } from '@azure/cosmos';
import bodyParser from 'body-parser';
import express from 'express';
import { TripDto } from '../types'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })


const endpoint = process.env.COSMOS_URL
const key = process.env.COSMOS_KEY

if (!endpoint || !key) throw ("Missing cosmosDB variables")

const client = new CosmosClient({ endpoint, key });
const tripsCollection = client.database('hopngo').container('trips')
const usersCollection = client.database('hopngo').container('users')

const router = express.Router();

var jsonParser = bodyParser.json()

router.get('/from/:from/to/:to/date/:date', async (req, res) => {
    try {
        const { from, to, date } = req.params;
        const tripsResult = await tripsCollection.items.readAll().fetchAll()
        const tripsEntities = tripsResult.resources.map(x => {
            return {
                from: x.from,
                to: x.to,
                availableSeats: x.availableSeats,
                date: x.date,
                time: x.time,
                userEmail: x.userEmail,
                id: x.id
            }
        })

        const trips = tripsEntities.map(async x => {
            const query = `select * from users u where u.email='${req.user}'`
            const user = await usersCollection.items.query(query).fetchAll()
            let userEntity = { name: '', surname: '', bio: '' }
            if (user.resources && user.resources[0]) {
                userEntity = user.resources[0];

            }
            return {
                ...x, user: {
                    name: userEntity.name,
                    surname: userEntity.surname,
                    bio: userEntity.bio,
                }
            }
        })
        console.log('teste', tripsResult)
        const result = await Promise.all(trips)
        res.json(result);
    } catch (ex) {
        console.log(ex)
        res.status(500).json();
    }
});

router.get('/id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tripsResult = await tripsCollection.items.readAll().fetchAll()
        const tripsEntities = tripsResult.resources.map(x => {
            return {
                from: x.from,
                to: x.to,
                availableSeats: x.availableSeats,
                date: x.date,
                time: x.time,
                userEmail: x.userEmail,
                id: x.id
            }
        })
        const x = tripsEntities.find(x => x.id === id);
        const query = `select * from users u where u.email='${req.user}'`
        const user = await usersCollection.items.query(query).fetchAll()
        let userEntity = { name: '', surname: '', bio: '' }
        if (user.resources && user.resources[0]) {
            userEntity = user.resources[0];

        }
        const result = {
            ...x,
            user: {
                name: userEntity.name,
                surname: userEntity.surname,
                bio: userEntity.bio,
            }
        }
        res.json(result);
    } catch (ex) {
        console.log(ex)
        res.status(500).json();
    }
});

router.post('/', jsonParser, async (req, res) => {
    const trip = req.body;
    try {
        trip.userEmail = req.user
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