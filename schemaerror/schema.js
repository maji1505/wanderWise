

const ExpressError=require("../utils/ExpressError.js");
  let schemaValidate=function(req){
     if(req.body.title==null){
       return  new ExpressError(401,"send valid data for title listing");
     }
      if(req.body.price==null){
      return   new ExpressError(401,"send valid data for price listing");
     }
    else if(req.body.description==null){
      return  new ExpressError(401,"send valid data for description listing");
    }
    else if(req.body.country==null){
      return  new ExpressError(401,"send valid data for country listing");
    }
    else if(req.body.location==null){
      return  new ExpressError(401,"send valid data for location  listing");
    }
     else{
        return 0;
     }
    }
    module.exports=schemaValidate;

