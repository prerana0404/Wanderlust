const mongoose=require("mongoose");
const reviews = require("./reviews");
const { ref } = require("joi");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");

const listingSchema=new Schema({
    title:{
      type:   String,
      required:true,
    },
    description:String,
    image:{
        type:String,
        default:
           "https://unsplash.com/photos/an-aerial-view-of-a-wooded-area-with-a-satellite-dish-EdLtou2WSxU",
        set: (v) =>
        v==="" 
        ?"https://unsplash.com/photos/an-aerial-view-of-a-wooded-area-with-a-satellite-dish-EdLtou2WSxU"
        :v,

    },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",

      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});

  }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;