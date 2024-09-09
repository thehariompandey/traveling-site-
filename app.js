const express = require('express');
const app = express()
const mongoose = require("mongoose");
const listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


// MongoDB connection
const mongoose_url = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(() => {
    console.log("server is connected to database")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoose_url);
}
// view engine satup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middleware to parse form data
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req,res) =>{
    res.send("hi i am root")
});


// index route 

app.get('/listings', async (req , res) =>{
    const alllistings = await listing.find({});
    // console.log(alllistings)
    res.render("listings/index.ejs", {alllistings});
});

// new route
app.get("/listings/new" , (req , res) =>{
    res.render("listings/new.ejs");
});

// show route 

app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    try {
        const singleListing = await listing.findById(id);
        if (!singleListing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show.ejs", { listing: singleListing });
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while fetching the listing");
    }
});

// create route 
app.post('/listings' , async (req,res) =>{
 const newlisting = new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});

// Edit route 
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
    try {
        const listingToEdit = await listing.findById(id);
        if (!listingToEdit) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/edit", { listing: listingToEdit });
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while fetching the listing");
    }
});

// update route 
app.put("/listings/:id" , async (req,res) =>{
    let { id } = req.params;
    await listing.findByIdAndUpdate(id ,{...req.body.listing});
    res.redirect("/listings");

});

// delete route 
app.delete("/listings/:id" , async (req,res) =>{
    let { id } = req.params;
    let deletedlisting =  await listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");

})



// app.get('/testlisting' ,async(req, res ) =>{
//     let samplelisting = new listing({
//         title: "my new home",
//         description : "by the beach",
//         location : "goa",
//         country: "india",
//         price: 2000,
//     });

//     await samplelisting.save();
//     console.log("sample data is saved");
//     res.send("sucessfull");
// });


app.listen(8080 , ()=>{
    console.log("server is listening to port 8080");
});
    
