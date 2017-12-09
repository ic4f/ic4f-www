const mongoose = require('mongoose');
const ids = require('./_ids');
const project_ids   = ids.projects;
const language_ids  = ids.languages;
const framework_ids = ids.frameworks; 
const database_ids  = ids.databases;

const Project = new mongoose.Schema({
  // _id = project-id in data file
  _id: {
    type: String,
    lowercase: true,
   // enum: project_ids
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subproject_id: {
    type: String,
    lowercase: true,
    //enum: group_ids
  },
  subproject_name: {
    type: String,
    required: true
  },
  subproject_count: {
    type: Number,
    default: 1
  },
  date_start: {
    type: Date,
    required: true,
  },
  date_end: Date,
  github_repo: String,
  subrepo: [{
    type: Boolean,
    default: false}],
  languages: [{
    type: String,
    ref: 'Language',
    enum: language_ids}],
  frameworks: [{
    type: String,
    ref: 'Framework',
    enum: framework_ids}],
  databases: [{
    type: String,
    ref: 'Database',
    enum: database_ids}]
});

Project.statics.getList = function(callback) {
  return this
    .find({},{content:0})
    .sort({'date_start': -1})
    .populate({
      path: 'languages',
      select: 'id name',
      options: {sort: { order: 1 }}
    })
    .populate({
      path: 'frameworks',
      select: 'id name',
      options: {sort: { order: 1 }}
    })
    .populate({
      path: 'databases',
      select: 'id name',
      options: {sort: { _id: 1 }}
    })
    .exec(callback);
};

Project.statics.countByLanguage = function(language, callback) {
  return this.count({'languages':  language} , callback);
};

Project.statics.countByFramework = function(framework, callback) {
  return this.count({'frameworks': framework} , callback);
};

Project.statics.countByDatabase = function(database, callback) {
  return this.count({'databases': database} , callback);
};

mongoose.model('Project', Project, 'projects');
