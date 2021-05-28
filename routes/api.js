"use strict";

const Project = require("../model/project");
const Issue = require("../model/issue");
module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(async (req, res) => {
      try {
        let project_name = req.params.project;
        let queries = req.query;
        const foundProject = await Project.findOne({
          name: project_name,
        }).populate("issues");
        if (foundProject) {
          if (Object.keys(queries).length !== 0) {
            const filteredIssues = foundProject.issues.filter((issue) =>
              Object.keys(queries).every(
                (k) => String(issue[k]) == String(queries[k])
              )
                ? issue
                : null
            );
            return res.status(200).json(filteredIssues);
          }

          return res.status(200).json(foundProject.issues);
        } else {
          const newProject = new Project({ name: project_name });
          await newProject.save();
          return res.status(200).json(newProject.issues);
        }
      } catch (error) {
        res.json({ error: error.message });
      }
    })

    .post(async (req, res) => {
      try {
        let project_name = req.params.project;
        let project = await Project.findOne({ name: project_name });
        if (!project) {
          project = new Project({ name: project_name });
          await project.save();
        }
        const newIssue = new Issue(req.body);
        await newIssue.save();
        project.issues.push(newIssue);
        await project.save();
        return res.status(200).json(newIssue);
      } catch (error) {
        res.json({ error: "required field(s) missing" });
      }
    })

    .put(async (req, res) => {
      if (req.body._id) {
        try {
          let fields = [
            "issue_title",
            "issue_text",
            "created_by",
            "assigned_to",
            "open",
            "status_text",
          ];
          if (fields.some((i) => req.body.hasOwnProperty(i))) {
            let foundIssue = await Issue.findById(req.body._id);
            if (foundIssue) {
              let updatedIssue = await Issue.findByIdAndUpdate(req.body._id, {
                ...req.body,
              });
              return res.status(200).json({
                result: "successfully updated",
                _id: req.body._id,
              });
            } else {
              return res.json({ error: "could not update", _id: req.body._id });
            }
          } else {
            return res.json({
              error: "no update field(s) sent",
              _id: req.body._id,
            });
          }
        } catch (err) {
          return res.json({ error: "could not update", _id: req.body._id });
        }
      } else {
        return res.json({ error: "missing _id" });
      }
    })

    .delete(async (req, res) => {
      if (req.body._id) {
        try {
          const deletedIssue = await Issue.findByIdAndDelete(req.body._id);
          const updatedProject = await Project.findOneAndUpdate(
            { name: req.params.project },
            { $pull: { issues: req.body._id } }
          );
          res.status(200).json({
            result: "successfully deleted",
            _id: `${deletedIssue._id}`,
            // deletedIssue,
          });
        } catch (error) {
          return res.json({ error: "could not delete", _id: req.body._id });
        }
      } else {
        return res.json({ error: "missing _id" });
      }
    });
};
