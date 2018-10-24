const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const ImageSchema = mongoose.Schema({
    img: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    },
    imgThumbnail: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    hashName:{
        type: String,
        required: true
    }
});

const Image = module.exports = mongoose.model('Image', ImageSchema);


module.exports.getImageById = function (id, callback) {
    Image.findById(id, callback);
}


module.exports.getImages = function (callback) {
    const query = {}
    Image.find(query, callback);
}

module.exports.addImage = function (newImage, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newImage.hashName, salt, (err, hash) => {
            if (err) throw err;
            newImage.hashName = hash;
            newImage.save(callback);
        });
    });
}

module.deleteImage = function (id, callback) {
    Image.findByIdAndDelete(id, callback);
}