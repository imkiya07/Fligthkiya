base_url = https://fk-api.adbiyas.com

<!-- AIRPORT SEARCH API -->

GET: api/common/airports?size=25&search=

in search query you can search airport by airport code and airport city/location

<!-- SEARCH FLIGHTS -->

POST:api/b2c/search

NOTE:
In request body "AirTripType": "OneWay" // OneWay | Return | OpenJaw | Circle
OneWay:OneWay
RoundTrip:Return
MultiCity:OpenJaw

FOR ONE WAY REQUEST BODY:
{
"OriginDestinationInformations": [
{
"DepartureDateTime": "2025-02-03T00:00:00",
"OriginLocationCode": "BLR",
"DestinationLocationCode": "DXB"
}
],
"TravelPreferences": {
"AirTripType": "OneWay"
},
"PricingSourceType": "Public",
"PassengerTypeQuantities": [
{
"Code": "ADT",
"Quantity": 1
}
],
"RequestOptions": "Fifty"
}

FOR ROUND TRIP REQUEST BODY:
{
"OriginDestinationInformations": [
{
"DepartureDateTime": "2025-02-03T00:00:00",
"OriginLocationCode": "BLR",
"DestinationLocationCode": "DXB"
},
{
"DepartureDateTime": "2025-02-05T00:00:00",
"OriginLocationCode": "DXB",
"DestinationLocationCode": "BLR"
}
],
"TravelPreferences": {
"AirTripType": "Return"
},
"PricingSourceType": "Public",
"PassengerTypeQuantities": [
{
"Code": "ADT",
"Quantity": 1
}
],
"RequestOptions": "Fifty"
}

FOR MULTI CITY REQUEST BODY:
{
"OriginDestinationInformations": [
{
"DepartureDateTime": "2025-02-03T00:00:00",
"OriginLocationCode": "BLR",
"DestinationLocationCode": "DXB"
},
{
"DepartureDateTime": "2025-02-05T00:00:00",
"OriginLocationCode": "DXB",
"DestinationLocationCode": "JFK"
},
{
"DepartureDateTime": "2025-02-05T00:00:00",
"OriginLocationCode": "JFK",
"DestinationLocationCode": "DXB"
}
],
"TravelPreferences": {
"AirTripType": "OpenJaw"
},
"PricingSourceType": "Public",
"PassengerTypeQuantities": [
{
"Code": "ADT",
"Quantity": 1
}
],
"RequestOptions": "Fifty"
}
