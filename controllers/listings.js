const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
    // console.log(allListings);
}

module.exports.country=async(req,res,next)=>{
    let {country}=req.query;
let count=0
     const allListings = await Listing.find();
     for(listing of allListings){
        if(country==listing.country){
        count=1;
        break;
        }
     }
     if(count==0){
        req.flash("success", "No data found for searched Country");
        res.redirect("/listings");
      }
     else
    res.render("listings/country.ejs",{ allListings,country});
}

module.exports.category=async(req,res,next)=>{
        let {id:type}=req.params;
        if(type=="Trending") res.redirect("/listings");
        else{
        const allListings = await Listing.find();
        res.render("listings/category.ejs",{ allListings,type});
}
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
   let response=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send();
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
     await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");  //nested populate & chaining populate
    if (!listing) {
        req.flash('error', "your requested Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', "your requested Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let nData = req.body;
   let listing= await Listing.findByIdAndUpdate(id, {
        title: nData.title, description: nData.description, price: nData.price,
        location: nData.location, country: nData.country,category:nData.category
    });
    if(req.file){
        let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted");
    res.redirect("/listings");
}