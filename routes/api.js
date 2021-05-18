"use strict";
const express = require("express");
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
            //i have used String() but not sure how it is working
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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: "required field(s) missing" });
      }
    })

    .put(async (req, res) => {
      try {
        if (req.body._id) {
          let foundIssue = await Issue.findById(req.body._id);
          let fields = [
            "issue_title",
            "issue_text",
            "created_by",
            "assigned_to",
            "open",
            "status_text",
          ];
          if (fields.some((i) => req.body.hasOwnProperty(i))) {
           let updatedIssue = await Issue.findByIdAndUpdate(req.body._id,{...req.body})
            return res
              .status(200)
              .json({
                result: "successfully updated",
                _id: updatedIssue._id
              });
          } else {
            return res
              .status(500)
              .json({ error: "no update field(s) sent", _id: foundIssue._id });
          }
        } else {
          return res.status(500).json({ error: "missing _id" });
        }
      } catch (err) {
        return res
          .status(500)
          .json({ error: "could not update", _id: req.body._id });
      }
    })

    .delete(async (req, res) => {
      try {
        if (req.body._id) {
          const deletedIssue = await Issue.findByIdAndDelete(req.body._id);
          const updatedProject = await Project.findOneAndUpdate(
            { name: req.params.project },
            { $pull: { issues: req.body._id } }
          );
          res
            .status(200)
            .json({
              result: "successfully deleted",
              _id: `${deletedIssue._id}`,
              deletedIssue,
            });
        } else {
          return res.status(500).json({ error: "missing _id" });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ error: "could not delete", _id: req.body._id });
      }
    });
};
