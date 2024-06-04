const axios = require('axios');

const Testsomething = async () => {
    try {
        
        let uri_nearby_places = `https://localhost:3000/register`
        const response_nbplaces = await axios.get(uri_nearby_places);

        return response_nbplaces.data;
    } catch (e) {
        console.error('Error on test', e);
    }
};