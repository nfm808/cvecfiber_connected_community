const csv = require("csvtojson");
const Parse = {
	parseCSV: async (filePath) => {
		return await csv().fromFile(filePath);
	},
	deDuplicate: async (jsonArray) => {
		let test = await jsonArray;
		let filtered = await test.filter(
			(v, i, a) => a.findIndex((t) => t.Email === v.Email) === i
		);
		return filtered;
	},
};

module.exports = Parse;
