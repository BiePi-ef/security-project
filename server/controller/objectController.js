import Object from "../models/object.js";
import isAdmin from "../services/authService.js";

process.loadEnvFile("./.env");

// Schema of object in req.body =
// {
//   name: {type: String, required: true}, // required
//   categories: {type: String},
//   options: {
//     descriptions: {
//       descripton: String,
//       summary: String,
//     },
//     stats: { // if present, all fields are required
//       strength: {type: Int32, min: 0, max: 30},
//       dexterity: {type: Int32, min: 0, max: 30},
//       intelligence: {type: Int32, min: 0, max: 30},
//       constitution: {type: Int32, min: 0, max: 30},
//       wisdom: {type: Int32, min: 0, max: 30},
//       charisma: {type: Int32, min: 0, max: 30},
//     },
//     others: [{
//       name: String,
//       descripton: String,
//       content: String,
//     }]
//   },
//   author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
//   visibility: {type: [String], enum: ["Public", "Private"], required: true}, :
//   search_tags: [String],
//   created_at: { type: Date, default: Date.now },
//   last_updated_at: { type: [Date], default: [Date.now] },
// }

const create = async (req, res) => {
  try {
    let data = req.body

    // check the category.
    // if empty : creates an object
    // else : verifies all the necessary fields have been completed for the category
    if (data.category) {
      switch (data.category) {
        case "test":
          // TDO : implement a presets check that verifies if the information in the request is copmplete 
          break;
        default:
          break;
      }
    } else {
      data.category = "unlabeled";
    }

    if (!data.options) {
      data.options = {}
    }

    const newObject = await Object.create({
      name: data.name,
      category: data.category,
      options: data.options,
      visibility: data.visibility,
      search_tags: data.search_tags,
      author: req.user.id
    })

    return res.status(200).send({
      newObjectId : newObject.id
    });
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: 'Error during object creation'
    });
  }
}

// user get all public / admin get all
const getAll = async (req, res) => {
  try {
    let filter = req.query.filter
    let objects;

    if (isAdmin(req.user)) {
      switch (filter) {
        case "public":
          objects = await Object
            .find({visibility: filter})
            .exec();
          break;
          case "private":
            objects = await Object
            .find({visibility: "private"})
            .exec();
            break;
          default:
            objects = await Object
            .find()
            .exec();
            break;
      }
    } else {
      switch (filter){
        case "public":
          objects = await Object
          .find(
            {visibility: 'public'},
          )
          .exec();
          break;
        case "private":
          objects = await Object
          .find({ $and: [ 
            {visibility: "private"},
            {author: req.user.id},
          ]})
          .exec();
          break;
        default:
          objects = await Object
          .find({ $or: [
            {visibility: "public"},
            {author: req.user.id},
          ]})
          .exec();
          break;
      } 
    }

    return res.status(200).send({
      objects: objects
    });
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: 'Error during object creation'
    });
  }
}

// get all by user 
//  L> if user id === current user id || current user isAdmin() : get public and private
//  l> else : get public

const getOneById = async (req, res) => {
  try {
    if (isAdmin(req.user)) {
      const found = await Object.findById(
        req.params.id
      ).exec();
      return res.status(200).send({ object: found });
    } else {
      const found = await Object.findOne({
        $or : [
          { _id: req.params.id, author: req.user.id },
          { _id: req.params.id, visibility: "public" }
        ]
      }).exec();
      if (found) {
        return res.status(200).send({ object: found });
      }
      return res.status(404).send({ message: 'Object not found or unauthorized' });
    }

  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: 'Error during object retrieval'
    });
  }
};

// update
// if user id === current user id || current user isAdmin()

// delete
// if user id === current user id || current user isAdmin()

export default {
  create,
  getAll,
  getOneById,
}