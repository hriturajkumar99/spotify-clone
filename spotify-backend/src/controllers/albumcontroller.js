// import {v2 as cloudinary} from 'cloudinary'
// import albumModel from '../models/albumModel.js'


// const addAlbum = async (req,res) =>{

//     try {

//         const name = req.body.name;
//         const desc = req.body.desc;
//         const bgColor = req.body.bgColor;
//         const imageFile = req.file;
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
        
//         const albumData = {
//             name,
//             desc,
//             bgColor,
//             image: imageUpload.secure_url
//         }


//         const album = albumModel(albumData);
//         await albumData.save();

//          res.json({success:true, message:"album added"});
        
//     } catch (error) {
//         res.json({success:false})
//     }

// }

// const listAlbum = async (req,res) =>{
    
// }

// const removeAlbum = async (req,res) =>{
    
// }


// export { addAlbum,listAlbum,removeAlbum}



import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';
import streamifier from 'streamifier';

const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColor } = req.body;
        const imageFile = req.file; // Use req.file for single file upload

        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" });
        }

        // Upload to Cloudinary
        const uploadStream = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(fileBuffer).pipe(uploadStream);
            });
        };

        const imageUpload = await uploadStream(imageFile.buffer);

        const albumData = new albumModel({
            name,
            desc,
            bgColor,
            image: imageUpload.secure_url // Use "image" field to match your model
        });

        await albumData.save();

        res.json({ success: true, message: "Album added" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const listAlbum = async (req, res) => {
    // Implementation for listing albums
};

const removeAlbum = async (req, res) => {
    // Implementation for removing an album
};

export { addAlbum, listAlbum, removeAlbum };
