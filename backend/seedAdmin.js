const bcrypt=require("bcryptjs");
const User=require("./models/User");
const connectDB=require("./config/db");

connectDB();

async function seed(){

const exists=await User.findOne({
email:"admin@gmail.com"
});

if(exists){

console.log("Admin already exists");
process.exit();

}

const hashed=await bcrypt.hash(
"admin123",
10
);

await User.create({

name:"Admin",

email:"admin@gmail.com",

password:hashed,

role:"admin"

});

console.log("Admin created");

process.exit();

}

seed();