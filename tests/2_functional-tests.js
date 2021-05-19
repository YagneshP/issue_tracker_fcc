process.env.NODE_ENV = "test";
const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const Issue = require("../model/issue");
const Project = require("../model/project");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.beforeEach(async () => {
    await Project.deleteMany({});
    await Issue.deleteMany({});
  });
  this.afterEach(async () => {
    await Project.deleteMany({});
    await Issue.deleteMany({});
  });
  // GET request test cases
  suite("GET Routes testing", function () {
    // You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.
    // View issues on a project: GET request to /api/issues/{project}
    test("GET / get all issues for the project", async function () {
      let newProject = createProject();
      let newIssue = createIssue(allFields);
      await newProject.save();
      await newIssue.save();
      newProject.issues.push(newIssue);
      await newProject.save();
      let res = await chai
        .request(server)
        .get("/api/issues/" + newProject.name);
      assert.equal(res.status, 200);
      assert.isArray(res.body, "issues should be array");
      assert.property(res.body[0], "_id", 'issue should have "id" property');
      assert.property(
        res.body[0],
        "issue_title",
        'issue should have "issue_title" property'
      );
      assert.property(
        res.body[0],
        "issue_text",
        'issue should have "issue_text" property'
      );
      assert.property(
        res.body[0],
        "created_by",
        'issue should have "created_by" property'
      );
      assert.property(
        res.body[0],
        "assigned_to",
        'issue should have "assigned_to" property'
      );
      assert.property(res.body[0], "open", 'issue should have "open" property');
      assert.property(
        res.body[0],
        "status_text",
        'issue should have "status_text" property'
      );
      assert.property(
        res.body[0],
        "created_on",
        'issue should have "created_on" property'
      );
      assert.property(
        res.body[0],
        "updated_on",
        'issue should have "updated_on" property'
      );
    });

    // You can send a GET request to /api/issues/{projectname} and filter the request by also passing along any field and value as a URL query (ie. /api/issues/{project}?open=false). You can pass one or more field/value pairs at once.
    // View issues on a project with one filter: GET request to /api/issues/{project}
    test("GET / filter issues with singe query", async () => {
      let newProject = createProject();
      let newIssue = createIssue(allFields);
      await newProject.save();
      await newIssue.save();
      newProject.issues.push(newIssue);
      await newProject.save();
      let res = await chai
        .request(server)
        .get(`/api/issues/${newProject.name}?open=false`);
      assert.equal(res.status, 200);
      assert.equal(res.body.length, 0);
    });
    // View issues on a project with multiple filters: GET request to /api/issues/{project}
    test("GET / filter issues with multiple queries", async () => {
      let newProject = createProject();
      let newIssue = createIssue(allFields);
      await newProject.save();
      await newIssue.save();
      newProject.issues.push(newIssue);
      await newProject.save();
      let res = await chai
        .request(server)
        .get(
          `/api/issues/${newProject.name}?open=true&issue_title=first_issue`
        );
      assert.equal(res.status, 200);
      assert.equal(res.body.length, 1);
      assert.propertyVal(
        res.body[0],
        "issue_title",
        "first_issue",
        'issue_title should be "first_issue"'
      );
      assert.propertyVal(res.body[0], "open", true, 'open should be "true"');
    });
  });
  // POST request test cases
  suite("POST Routes testing", function () {
    // You can send a POST request to /api/issues/{projectname} with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.
    // Create an issue with every field: POST request to /api/issues/{project}
    test("POST / create issue with all field", function (done) {
			// let project = createProject()
      let newIssue = createIssue(allFields);
      chai
        .request(server)
        .post('/api/issues/:project')
        .send(newIssue)
        .end(function (err, res) {
					// console.log("response",res)
          assert.equal(res.status, 200);
          assert.isObject(res, "Issue should be an Object");
          assert.property(res.body, "_id");
          assert.propertyVal(
            res.body,
            "issue_title",
            "first_issue",
            'issue_title should be "first_issue"'
          );
          assert.propertyVal(
            res.body,
            "issue_text",
            "issue_text",
            'issue_text should be "issue_text"'
          );
          assert.propertyVal(
            res.body,
            "created_by",
            "user",
            'created_by should be "user"'
          );
          assert.propertyVal(
            res.body,
            "assigned_to",
            "different user",
            'assigned_to should be "different user"'
          );
          assert.propertyVal(res.body, "open", true, 'open should be "true"');
          assert.propertyVal(
            res.body,
            "status_text",
            "open",
            'status_text should be "open"'
          );
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          done();
        });
    });
    // The POST request to /api/issues/{projectname} will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.
    // Create an issue with only required fields: POST request to /api/issues/{project}
    test("POST / create an issue with only required field", (done) => {
			// let project = createProject()
      let newIssue = createIssue(requiredField);
      chai
        .request(server)
        .post('/api/issues/:project')
        .send(newIssue)
        .end((err, res) => {
          if (err) done(err);
					// console.log("response",res)
          assert.equal(res.status, 200);
          assert.propertyVal(
            res.body,
            "assigned_to",
            "",
            "assigned_to should be empty string if not specified"
          );
          assert.propertyVal(
            res.body,
            "status_text",
            "",
            'status_text sholud be empty string'
          );
          done();
        });
    });
    // If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
    // Create an issue with missing required fields: POST request to /api/issues/{project}
    test("POST / missing required field", (done) => {
			let project = createProject()
      let newIssue = new Issue({});
      chai
        .request(server)
        .post(`/api/issues/${project.name}`)
        .send(newIssue)
        .end((err, res) => {
          if (err) done(err);
          // assert.equal(res.status, 500);
          assert.propertyVal(res.body, "error", "required field(s) missing");
          done();
        });
    });
  });

  suite("PUT / routes", function () {
    // Update one field on an issue: PUT request to /api/issues/{project}
    test("PUT / Update one field on an issue", async function () {
      let issue = createIssue(allFields);
      await issue.save();
      let res = await chai
        .request(server)
        .put("/api/issues/:project")
        .send({ _id: issue._id, open: false });
      assert.equal(res.status, 200);
      assert.propertyVal(
        res.body,
        "result",
        "successfully updated",
        "Should update successfully"
      );
      assert.propertyVal(
        res.body,
        "_id",
        `${issue._id}`,
        "should be the issue._id"
      );
    });
    // Update multiple fields on an issue: PUT request to /api/issues/{project}
    test("PUT / Update multiple fields on an issue", async function () {
    
			let issue = createIssue(allFields);
      await issue.save();
      let res = await chai
        .request(server)
        .put('/api/issues/:project')
        .send({ _id: issue._id, open: false, assigned_to: "freecodecamp" });
      assert.equal(res.status, 200);
      assert.propertyVal(
        res.body,
        "result",
        "successfully updated",
        "Should update successfully"
      );
      assert.propertyVal(
        res.body,
        "_id",
        `${issue._id}`,
        "should be the issue._id"
      );
      
    });
    // Update an issue with missing _id: PUT request to /api/issues/{project}
    test("PUT / Update an issue with missing _id", async function () {
			// let project = createProject();
      let issue = createIssue(allFields);
      await issue.save();
      let res = await chai
        .request(server)
        .put('/api/issues/:project')
        .send({ open: false, assigned_to: "freecodecamp" });
      // assert.equal(res.status, 500);
      assert.propertyVal(
        res.body,
        "error",
        "missing _id",
        "Should get missing _id error when _id not provided"
      );
    });
    // Update an issue with no fields to update: PUT request to /api/issues/{project}
    test("PUT / Update an issue with no fields to update", async function () {
			// let project = createProject();
      let issue = createIssue(allFields);
      await issue.save();
      let res = await chai
        .request(server)
        .put('/api/issues/:project')
        .send({ _id: issue._id });
      // assert.equal(res.status, 500);
      assert.propertyVal(
        res.body,
        "error",
        "no update field(s) sent",
        "Should get missing fields error when fileds are not provided"
      );
    });
    // Update an issue with an invalid _id: PUT request to /api/issues/{project}
    test("PUT /  Update an issue with an invalid _id", async function () {
      let issue = createIssue(allFields);
      await issue.save();
      let res = await chai
        .request(server)
        .put('/api/issues/:project')
        .send({ _id: "60a555b8eca7e20015e3920d" });
      // assert.equal(res.status, 500);
			// console.log(res);
      assert.propertyVal(
        res.body,
        "error",
        "could not update",
        "not updating for any other id"
      );
			// assert.propertyVal(
      //   res.body,
      //   "_id",
      //   "60a555b8eca7e20015e3920d",
      //   "invalid id"
      // );
    });
  });

  suite("DELETE / route", function () {
    // Delete an issue: DELETE request to /api/issues/{project}
    test("DELETE/ Delete an issue", async () => {
			let project = createProject();
      let issue = createIssue(allFields);
      await issue.save();
      let res = await chai
        .request(server)
        .delete(`/api/issues/${project.name}`)
        .send({ _id: issue._id });
      assert.equal(res.status, 200);
      assert.propertyVal(
        res.body,
        "result",
        "successfully deleted",
        "with proper _id ,issue should be deleted"
      );
      // assert.equal(
      //   res.body.deletedIssue._id,
      //   `${issue._id}`,
      //   "deleted id should same as issue id"
      // ); // remove this if fcc test doent pass
    });
    // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    test("DELETE/ Delete an issue with an invalid _id", async () => {
			let project = createProject();
      let issue = createIssue(allFields);
      await issue.save();
      let res = await chai
        .request(server)
        .delete(`/api/issues/${project.name}`)
        .send({ _id: "12385959749hff" });
      // assert.equal(res.status, 500);
      assert.propertyVal(
        res.body,
        "error",
        "could not delete",
        "with invalid _id or any issue can not delete issue"
      );
    });
    // Delete an issue with missing _id: DELETE request to /api/issues/{project}
    test("DELETE/ Delete an issue with missing _id", async () => {
			let project = createProject();
      let issue = createIssue(allFields);
      await issue.save();
      let res = await chai
        .request(server)
        .delete(`/api/issues/${project.name}`)
        .send({});
      // assert.equal(res.status, 500);
      assert.propertyVal(
        res.body,
        "error",
        "missing _id",
        "missing _id in req.body"
      );
    });
  });
});

// utils
let createProject = () => {
  let project = new Project({
    name: "TestProject",
  });
  return project;
};

let createIssue = (obj) => {
  let issue = new Issue(obj);
  return issue;
};

let allFields = {
  issue_title: "first_issue",
  issue_text: "issue_text",
  created_by: "user",
  assigned_to: "different user",
  open: true,
  status_text: "open",
};

let requiredField = {
  issue_title: "first_issue",
  issue_text: "issue_text",
  created_by: "user",
};
