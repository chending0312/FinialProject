//Seeds the data retrieved from the API through ASIN ID and inserts it into the 
//database
const mongoose = require('mongoose');
const Product = require('../models/product');
const allProducts = require('./beautyProducts');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

for (let i = 0; i < 5; i++) {
    const params = {
        api_key: "3E1E04C706664B36BFE1D51A94CAA873",
        type: "product",
        amazon_domain: "amazon.com",
        asin: `${allProducts[i]}`
    }

    //Make the HTTP GET request to Rainforest API
    axios.get('https://api.rainforestapi.com/request', { params })
        .then(response => {
            // print the JSON response from Rainforest API
            //console.log(JSON.stringify(response.data, 0, 2));
            console.log(response.data.product.title);
            seedData(response);
        }).catch(error => {
            // catch and print the error
            console.log(error);
        })
}

const seedData = async (res) => {

    let tempTitle = res.data.product.title;
    let tempAsin = res.data.product.asin;
    let tempImage = res.data.product.variants[0].main_image;

    const prod = new Product({
        title: `${tempTitle}`,
        asin: `${tempAsin}`,
        image: `${tempImage}`
    })

    await prod.save();
}

/*
    title: String,
    price: Number,
    asin: String,
    category: [String],
    rating: {
        totalRatings: String,
        score: String
    },
    specifications: [String],
    productDetails: {
        firstAvailable: String,
        weight: String
        brand: String
*/
