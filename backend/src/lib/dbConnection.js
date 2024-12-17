 const mongoose=require('mongoose');

 async function connection() {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('database connected');
    }
    catch(error){ 
        console.log(error);
    }  

    
 }

 module.exports=connection;