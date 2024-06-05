# Tyba Backend Test
## Running locally
run
```bash
docker-compose up --build
```
This create the containers for the app and a MySQL instance linked by a Docker network, and create the database and tables needed to run the app. 

For now no data is saved if the container is shut down because no volume is created.

Replace ``GOOGLE_PLACES_API_KEY`` with a Google Places API key with Geocoding and Places API enabled [More details about Google Places API key here](https://developers.google.com/maps/documentation/places/web-service/get-api-key)

The environment variables required are:
```bash
MYSQL_HOST="mysql"
MYSQL_USER="root"
MYSQL_PASSWORD="password"
MYSQL_DATABASE="API_REST_Tyba"
PORT = 3000
API_PLACES_KEY = "GOOGLE_PLACES_API_KEY"
JWT_SECRET = "123456789"
```
They are read locally in the .env file by the `dotenv` library

Once the containers are up you can test the request importing the Postman collection on the postman folder

## The requests are:

- ### GET `/login`
Login a user and return a JWT Token
Need to be authenticated? `NO`

Body
```json
{
    "password":"password",
    "username":"vdiegox"
}
```
Response
```json
{
    "status": "User logged in successfully!",
    "token": "token"
}
```
OR
```json
Invalid credentials
```
- ### POST `/register`
Register an user

Need to be authenticated? `NO`

Body
```json
{
    "name":"Diego",
    "password":"password",
    "username":"vdiegox"
}
```
Response
```json
{
    "status": "User registered successfully!"
}
```
OR
```json
Username already exist
```
- ### GET `/logout`
Logout user and invalidate the JWT Token
Need to be authenticated? `YES`

Body None

Response
```json
{
    "status": "User logged out successfully!"
}
```
OR
```json
Token has been invalidated
```
- ### GET `/restaurants`
Return the nearby restaurants given a city or a location by coordinates 

Need to be authenticated? `YES`

Body
```json
{
    "city":"Berlin"
}
```
OR
```json
{
    "lat":"Berlin",
    "lng":"Berlin"
}
```
Response
```json
{
    "html_attributions": [],
    "next_page_token": "AUGGfZk3nolJLBo_cs1DT5Sq4EZNF2ayypfdb_E7-yrGJyFki0I6ptzL-CoK8ZvxqMT7Zb6quNva6A3wrzdR8YxKgqbkswX6OQyK1jj-kcyPl8eVHQMLF8fAmM14XhvaqR3taIqiSd0is8Rzm4zsNNYlyKcE2oY8272pR-sBOiAKZ0oaXeGCI4sS3u6QI8Yq30X81IPdD7eL0iwQRLYVQQn-u33P0Sed1nvoqAetiMX-ANMSBo3lsTClfkn2CmvenPm4yxZ0r-gmwct_mb12NW_odtSJasOH-BP7oRWatq5lKoJbBWTkV7pV3HCED_tzhlF3EPwlOpnIr0ysqUkakH08tPeF-SzDoExwr8_J1xJUhuPuVK6-xFnjrjwoF42qDeYJhP9hZ1lzqwnovAWyqEXi3xuAzzrgN7RivAH8w2tMsWIZArLvBIBCsgcCq3-J",
    "results": [
        {
            "business_status": "CLOSED_TEMPORARILY",
            "geometry": {
                "location": {
                    "lat": 52.5195799,
                    "lng": 13.4027302
                },
                "viewport": {
                    "northeast": {
                        "lat": 52.5210390802915,
                        "lng": 13.4044997302915
                    },
                    "southwest": {
                        "lat": 52.5183411197085,
                        "lng": 13.4018017697085
                    }
                }
            },...
}
```
- ### GET `/record`
Return the movements/transactions record of the current logged user

Need to be authenticated? `YES`

Body None

Response
```json
[
    {
        "id": 1,
        "username": "vdiegox",
        "date": "2024-06-04T21:33:33.000Z",
        "action": "Register"
    },
    {
        "id": 2,
        "username": "vdiegox",
        "date": "2024-06-04T21:33:42.000Z",
        "action": "Login"
    },
    {
        "id": 3,
        "username": "vdiegox",
        "date": "2024-06-04T21:33:50.000Z",
        "action": "CheckNearbyRestaurants"
    }
]
```
