// import {v2 as cloudinary} from 'cloudinary'
// import songModel from '../models/songModle.js';
// import upload from '../middelware/multer.js';

// const addSong = async (req,res)=>{

//     try {

//         const name = req.body.name;
//         const desc = req.body.desc;
//         const album = req.body.album;
//         const audioFile = req.files.audio[0];
//         const imageFile = req.files.image[0];
//         const audioUpload = await cloudinary.uploader.upload(audioFile.path,{resource_type:"video"});
//         const imageUpload = await cloudinary.uploader.upload(audioFile.path,{resource_type:"image"});

//         console.log(name,desc,album,audioUpload,imageUpload);

//     } catch (error) {

//     }

// }

// const listSong = async (req,res)=>{

// }

// export { addSong,listSong}




import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModle.js";

const addSong = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    const { name, desc, album } = req.body;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
      audioUpload.duration % 60
    )}`;

    console.log(name, desc, album, audioUpload, imageUpload);
    res
      .status(200)
      .json({ success: true, message: "Song added successfully!" });

    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    };

    const song = songModel(songData);
    await song.save();

    // res.json({ success: true, massage: "song added" });
  } catch (error) {
    console.error("Error in addSong:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add song",
        error: error.message,
      });
    // res.json({ success: false });
  }
};

const listSong = async (req, res) => {
  // Implementation for listing songs
    try {
        const allSongs = await songModel.find({});
        res.json({success:true,songs:allSongs});
    } catch (error) {
        res.json({success:false});
    }

};

const removeSong = async (req, res) => {
    try {
      const { id } = req.body;
      console.log("ID to delete:", id);
      const song = await songModel.findByIdAndDelete(id);
      if (!song) {
        return res.status(404).json({ success: false, message: "Song not found" });
      }
      res.json({ success: true, message: "Song removed" });
    } catch (error) {
      console.error("Error in removeSong:", error);
      res.json({ success: false });
    }
  };
  


export { addSong, listSong, removeSong };


 