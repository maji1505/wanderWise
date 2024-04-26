const ExpressError = require("./ExpressError.js");

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{ next(err)});
    }
}
module.exports=wrapAsync;