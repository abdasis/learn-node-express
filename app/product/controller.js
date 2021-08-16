const Product  = require('./model');
const config = require('../config');
const fs  = require('fs');
const path = require('path');
const slugify = require('slugify');


async function store(req, res, next){
    try{
        let payload = req.body;

        if (req.file){
            let  tmp_path = req.file.path;
            let filename = slugify(req.file.originalname, '-');
            let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

            const destination = path.dirname(target_path);

            fs.mkdirSync(destination, {recursive: true});
            fs.renameSync(tmp_path, target_path);

            let product = new Product({...payload, image_url: req.protocol + '://' + req.get('host') + '/upload/'+ filename});
            await product.save();
            return res.json(product);
        }else{
            let product = new Product(payload);
            await product.save();
            return res.json(product);
        }

    }catch (err){
        if (err && err.name === 'ValidationError')
        {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }

        next(err)
    }
}

async function index(req, res, next){
    try{
        let {limit = 10, skip = 0} = req.query;


        let products = await Product.find().limit(parseInt(limit)).skip(parseInt(skip));
        return res.json(products);
    }catch (err){
        next(err)
    }
}


module.exports = {
    store, index
}