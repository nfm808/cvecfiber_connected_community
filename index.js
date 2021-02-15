require("dotenv").config();
const Parse = require("./parse/parse");
const WriteDocument = require("./fsWrite/fsWrite");
const GoogleApi = require("./geoApi/geoApi");
const BottleNeck = require("bottleneck/es5");

const limiter = new BottleNeck({
	minTime: 20,
});

const filePath = "./rawCSV/connected_community.csv";
const filePathT = "./test2.csv";

const apiKey = process.env.GOOGLE_API_KEY;

const outputFilename = "./processedCSV/processed_connected_community.csv";

async function parseFile(filePath) {
	try {
		// convert the csv to json for processing
		let json = await Parse.parseCSV(filePath);

		// remove duplicate entries by email
		let deDuplicatedData = await Parse.deDuplicate(json);

		console.log("Geocoding against Google API");

		// run data through google geocode api
		async function addGeoCodeData() {
			const geoCoded = deDuplicatedData.map((row, i) => {
				// apply limiter to prevent being rate-limited
				return limiter.schedule(() => {
					return GoogleApi.geoCode(row, apiKey, i);
				});
			});

			return await Promise.all(geoCoded).then((info) => info);
		}

		// get the geocoded data into a variable
		let coded = await addGeoCodeData();

		// get header values
		let headers = `${Object.keys(deDuplicatedData[0]).join(",")},lat,lng,\n`;

		// convert the json back to csv format
		let back2csv = coded.map((x) => x && Object.values(x).join(",")).join("\n");

		// write headers in new csv file
		WriteDocument.headers(outputFilename, headers);

		// write the new csv file
		WriteDocument.csvData(outputFilename, back2csv);
	} catch (error) {
		console.error(error);
	}
}

parseFile(filePath);
