'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
			console.log('body', req.body);
     
    })
    
    .post(function (req, res){
      let project = req.params.project;
			console.log('body', req.body);
			res.send("created new issue");
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let id = req.body.id;
			console.log("id",id);
			console.log("heelo");
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
