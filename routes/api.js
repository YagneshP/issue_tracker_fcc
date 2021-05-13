'use strict';
const express = require('express');
const Project = require("../model/project");
const Issue = require('../model/issue');
module.exports = function (app) {
  app.route('/api/issues/:project')
  
    .get(async (req, res) =>{
			try {
			// View issues on a project with one filter: GET request to /api/issues/{project}
			// View issues on a project with multiple filters: GET request to /api/issues/{project}
      let project_name = req.params.project;
			const foundProject =  await Project.findOne({name:project_name}).populate('issues');
			if(foundProject){
			// View issues on a project: GET request to /api/issues/{project}
			return	res.status(200).json(foundProject.issues);
			} else{
				const newProject = new Project({name:project_name});
				await newProject.save();		
			// View issues on a project: GET request to /api/issues/{project}
				return res.status(200).json(newProject.issues);
			}
			} catch (error) {
				res.status(500).json({error: error.message});
			}

    })
    
    .post(async (req, res)=>{
			// Create an issue with every field: POST request to /api/issues/{project}
			// Create an issue with only required fields: POST request to /api/issues/{project}
			// Create an issue with missing required fields: POST request to /api/issues/{project}
      let project_name = req.params.project;
			let project = await Project.findOne({name:project_name});
			if(!project){
				project = new Project({name:project_name});
				await project.save();
			}
			const newIssue = new Issue(req.body);
			await newIssue.save((err)=>{
				console.log(err);
			});
			 project.issues.push(newIssue);
			await project.save();
			console.log(project);
			res.status(200).json(newIssue);
    })
    
    .put(function (req, res){
			// Update one field on an issue: PUT request to /api/issues/{project}
			// Update multiple fields on an issue: PUT request to /api/issues/{project}
			// Update an issue with missing _id: PUT request to /api/issues/{project}
			// Update an issue with no fields to update: PUT request to /api/issues/{project}
			// Update an issue with an invalid _id: PUT request to /api/issues/{project}
      let project = req.params.project;
      let id = req.body.id;
			console.log("id",id);
			res.send("heelo");
    })
    
    .delete(function (req, res){
			// Delete an issue: DELETE request to /api/issues/{project}
			// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
			// Delete an issue with missing _id: DELETE request to /api/issues/{project}
      let project = req.params.project;
      let id = req.body.id;
			console.log("id",req.body);
			res.send("delete");
    });
    
};
