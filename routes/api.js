'use strict';
const express = require('express');
module.exports = function (app) {
  app.route('/api/issues/:project')
  
    .get(function (req, res){
			// View issues on a project: GET request to /api/issues/{project}
			// View issues on a project with one filter: GET request to /api/issues/{project}
			// View issues on a project with multiple filters: GET request to /api/issues/{project}
      let project = req.params.project;
			let query = req.query;
			console.log(query);
			console.log("project",project);
     res.send("This is a get route for project issues");
    })
    
    .post(function (req, res){
			// Create an issue with every field: POST request to /api/issues/{project}
			// Create an issue with only required fields: POST request to /api/issues/{project}
			// Create an issue with missing required fields: POST request to /api/issues/{project}
      let project = req.params.project;
			console.log('body', req.body);
			res.send("created new issue");
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
