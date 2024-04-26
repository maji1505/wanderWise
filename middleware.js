 const Listing=require("./models/listing");
const Review = require("./models/review");

 module.exports.isLoggedin=(req,res,next)=>{
  //  console.log(req.path ,"..", req.originalUrl ,req.path)
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to Wanderlust!");
        return res.redirect("/login");
     }
    
     next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  
  if( req.session.redirectUrl)
   res.locals.redirectUrl=req.session.redirectUrl;
   //  console.log(`url is ${res.locals.redirectUrl}`);
   next();
}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals (res.locals.curUser._id)){
req.flash("error","You are not the owner of this Listing");
return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if( !review.author.equals (res.locals.curUser._id)){
req.flash("error","You are not the author of this Review");
return res.redirect(`/listings/${id}`);
  }
  next();
}