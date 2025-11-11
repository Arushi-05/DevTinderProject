const authAdmin=(req, res, next)=>{
    console.log("Admin authorisation in process.")
    const token="abcd";
    const isAdminAuthorised= token==="abc1d"
    if (isAdminAuthorised){
        next()
    }
    else{
        res.status(401).send("error was there");  
    }

}

module.exports=authAdmin