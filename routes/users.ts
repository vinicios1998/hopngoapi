import { CosmosClient } from '@azure/cosmos';
import bodyParser from 'body-parser';
import express from 'express';
import { LoginDto, NewUserDto, TripEntity, UserEntity } from '../types'
import dotenv from 'dotenv'
import { generateAccessToken } from '../utils/authUtils'
dotenv.config({ path: './.env' })


const endpoint = process.env.COSMOS_URL
const key = process.env.COSMOS_KEY

if (!endpoint || !key) throw ("Missing cosmosDB variables")

const client = new CosmosClient({ endpoint, key });
const usersCollection = client.database('hopngo').container('users')

const router = express.Router();

var jsonParser = bodyParser.json()


router.post('/', jsonParser, async (req, res) => {
    function validateNewUser(user: any): user is NewUserDto {
        if (
            typeof user.name !== 'string' ||
            typeof user.surname !== 'string' ||
            typeof user.email !== 'string' ||
            typeof user.password !== 'string' ||
            typeof user.bio !== 'string' ||
            user.password.length < 3 ||
            user.email.length < 3 ||
            !user.email.includes('@')
        ) {
            return false;
        }
        return true;
    }
    const user = req.body as NewUserDto;
    try {
        if (validateNewUser(user)) {
            const userEntity: UserEntity = {
                name: user.name,
                surname: user.name,
                email: user.email.toLowerCase(),
                password: user.password,
                bio: user.bio,
            }
            const result = await usersCollection.items.create<UserEntity>(userEntity)
            return res.status(result.statusCode).json();
        }
        return res.status(204).json();
    } catch (ex) {
        console.log(ex)
        res.status(500).json();
    }
});

router.post('/login', jsonParser, async (req, res) => {
    function validateLogin(login: any): login is LoginDto {
        if (
            typeof login.email !== 'string' ||
            typeof login.password !== 'string'
        ) {
            return false;
        }
        return true;
    }
    const login = req.body as LoginDto;
    try {
        if (validateLogin(login)) {
            const query = `select * from users u where u.email='${login.email}' and u.password='${login.password}'`
            const user = await usersCollection.items.query(query).fetchAll()
            if (user.resources.length) {
                const token = generateAccessToken(login.email);
                return res.status(200).json({ token });
            }
        }
        return res.status(401).json()
    } catch (ex) {
        console.log(ex)
        return res.status(401).json()
    }
});

export default router