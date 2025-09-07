const config = require(`../../config/env/${process.env.NODE_ENV}.config.json`)
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloudinary.cloudname,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

const multer = require('koa-multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImages = upload.array('photos', 10);

const cloudinaryUpload = async (ctx, next) => {
    console.log('request reached here!')
    try {
        const files = ctx.request.body.photos; 
        const uploadPromises = files && files.map(file => {
            return cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                if (error) {
                    throw new Error(error);
                }
                return result.secure_url;
            }).end(file.buffer);
        });

        const results = await Promise.all(uploadPromises);
        ctx.request.body.photos = results; 
        await next(); 
    } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = 'Error uploading images to Cloudinary';
    }
};

module.exports = { uploadImages, cloudinaryUpload };