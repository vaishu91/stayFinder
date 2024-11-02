const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Model/listing.js");

const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";//creating database

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MongoURL);
};


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "66d321d14e5cd82f2e6cf9e1"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();