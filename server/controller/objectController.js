import Object from "../models/object.js";

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
      newObjectId : "6929c1afd8c5e1e0486e1d32"
    });;
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: 'Error during object creation'
    });
  }
}


// get all by user 
//  L> if user id === current user id || current user isAdmin()  : get public and private
//  l> else : get public

// get all public
// get all private
// -> calls a service that takes an argument public/private

// update
// if user id === current user id || current user isAdmin()

// delete
// if user id === current user id || current user isAdmin()

export default {
  create,
}