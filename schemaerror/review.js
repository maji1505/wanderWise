const ExpressError=require("../utils/ExpressError.js");

 // for reviews schema/////////////////////
 let reviewValidate=function(req){
    if(req.body.comment==null){
    return new ExpressError(401,"review.comment is required");
  }
 else if(req.body.rating>5 || req.body.rating==null){
    return new ExpressError(402,"enter rating between 1 to 5");
  }
  else{
    return 0;
  }
}
module.exports=reviewValidate;