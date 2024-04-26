const  mongoose=require("mongoose");
const data=require("./data.js");
const Listing=require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then((res)=>{
    console.log("mongodb")
}).catch((err)=>{
    console.log(err);
});

const initDb= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("data was intilize")
}
initDb();