As of right now, all routes require a okta token to access the endpoints. 

I updated the swagerdocs with current end-points.
To access them its \api-docs endpoint in a browser.

The ds endpoints require the ds api url set in env.
Okta also requires prams set in env.

I followed the folder schema as the pre-built api had set up.
The ds endpoints are under data.
User saved cities endpoint is under saved.

The saved cities endpoint returns only a object with saved city names and their respective city_state string required to pull data from the ds-api.
I also setup a way to pull ds data by using the city id setup to search as an endpoint. Ds supplied us a json of the city and id pairs. I used that to create this endpooint.

The next thing I would of worked on is checking that the object received from either front-end or iOS is what the DS-API is looking for. I was getting data that included the country,
which is not needed.
