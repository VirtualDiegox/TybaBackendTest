const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

const getNearbyPlacesByCity = async (city) => {
    try {
        // First we get the coordinates based on the city
        let key = process.env.API_PLACES_KEY;
        let uri_place = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${key}`
        const response = await axios.get(uri_place);

        const location_lat = response.data.results[0].geometry.location.lat
        const location_lng = response.data.results[0].geometry.location.lng

        // Then we use them to get the nearby restaurants
        let uri_nearby_places = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${key}&location=${location_lat}%2C${location_lng}&radius=1000&type=restaurant`
        const response_nbplaces = await axios.get(uri_nearby_places);

        return response_nbplaces.data;
    } catch (e) {
        console.error('Error on getNearbyPlacesByCity', e);
    }
};

const getNearbyPlacesByCordinates = async (location) => {
    try {
        let key = process.env.API_PLACES_KEY;
        let uri = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key${key}location=${location.lat}%2C${location.lng}&radius=1000&type=restaurant`
        const response = await axios.get(uri);
        //console.log(response.data);
        return response.data;
    } catch (e) {
        console.error('Error on getNearbyPlacesByCordinates', e);
    }
};

module.exports = {  getNearbyPlacesByCity,
                    getNearbyPlacesByCordinates };