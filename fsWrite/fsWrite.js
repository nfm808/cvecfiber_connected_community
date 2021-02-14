const fs = require("fs");

const WriteDocument = {
	headers: (fileName, headers) => {
		console.log(`preparing to write headers to filename: ${fileName}`);

		fs.writeFile(fileName, headers, (err) => {
			if (err) return console.error(err);
			console.log("Headers successfully written");
		});
	},
	csvData: (fileName, csvData) => {
		console.log(`Preparing to write out filename: ${fileName}`);

		fs.appendFile(fileName, csvData, (err) => {
			if (err) return console.error(err);
			console.log("File Successfully written!");
		});
	},
};
module.exports = WriteDocument;
