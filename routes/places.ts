import express from 'express';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) throw ("Missing GOOGLE_API_KEY variables")

const router = express.Router();

router.get('/geocode', async (req, res) => {
    const { placeId } = req.query;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.json(data);
});

router.get('/autocomplete', async (req, res) => {
    try {
        const { input } = req.query;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data)
            res.json(data.predictions.map((x: { description: any; place_id: any; }) => ({ description: x.description, place_id: x.place_id })))
        else
            res.json(data);
    }
    catch (e) {
        console.log(e)
        res.status(500)
        res.json(e)
    }

});
export default router