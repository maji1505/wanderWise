const mongoose = require("mongoose");
// const { stringify } = require("querystring");
const Schema = mongoose.Schema;
const Review=require("./review.js");

const ListiningSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required:true,
    },
    image: {
       url:String,
       filename:String,
       
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
         },
         geometry:{
            type:{
                type:String,
                enum:['Point'],
                required:true
            },
            coordinates:{
                type:[Number],
                required:true
            }
         },
         category:{
            type:String,
            required:true
         }
});


ListiningSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    await Review.deleteMany({_id:{$in:listing.reviews}});
});

const Listing = mongoose.model("Listing", ListiningSchema);
module.exports = Listing;