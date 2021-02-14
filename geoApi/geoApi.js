const fetch = require("node-fetch");

const GoogleApi = {
	geoCode: (row, apiKey, i) => {
		let baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";
		let addressString = `address=${row.Address.split(" ").join("+")}&`;
		let apiKeyString = `key=${apiKey}`;
		let url = baseUrl + addressString + apiKeyString;
		console.log("i: ", i);
		return fetch(encodeURI(url))
			.then((res) => (!res.ok ? row : res.json()))
			.then((body) => body)
			.then((data) => {
				return {
					Submitted_On: row.Submitted_On,
					Name: row.Name,
					Email: row.Email,
					Phone: row.Phone,
					Address: !data.results[0].formatted_address
						? ""
						: data.results[0].formatted_address,
					Account_Number: row.Account_Number,
					current_member: row.current_member,
					account_number: row.account_number,
					internet_provider: row.internet_provider,
					lat: !data.results[0].geometry.location.lat
						? ""
						: data.results[0].geometry.location.lat,
					lng: !data.results[0].geometry.location.lng
						? ""
						: data.results[0].geometry.location.lng,
				};

				//formatted_address: data.results[0].formatted_address,
				//geometry: data.results[0].geometry.location,
			})
			.catch((err) => console.error(err));
	},
};

module.exports = GoogleApi;
