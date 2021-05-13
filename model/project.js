const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	name:{
		type: String,
		unique:true
	},
	issues: [{
		type: mongoose.Types.ObjectId,
		ref:'Issue'
	}]
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;