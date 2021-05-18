process.env.NODE_ENV = 'test';
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Issue = require('../model/issue');
const Project = require('../model/project');


chai.use(chaiHttp);

suite('Functional Tests', function() {
	this.beforeEach(async()=>{
		await	Project.deleteMany({});
		await Issue.deleteMany({});
	})
	this.afterEach(async()=>{
		await	Project.deleteMany({});
		await Issue.deleteMany({});
	})
	// GET request test cases
  suite('GET Routes testing', function(){
		
		
		// You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.
		test('GET / get all issues for the project', async function(){ 
			const newProject = new Project({
				name: 'TestProject'
			})
			let newIssue = new Issue({
			issue_title:'first_issue in project',
			issue_text:'issue_text in project',
			created_by:'user in project',
			assigned_to:'different user in project',
			open:true,
			status_text:'open'
		})
	await	newProject.save();
	await newIssue.save();
	newProject.issues.push(newIssue)
	await newProject.save();
	let res = await	chai.request(server)
											.get("/api/issues/"+ newProject.name)
	assert.equal(res.status,200)
	assert.isArray(res.body,"issues should be array")
	// assert.property(res.body[0],'')
	assert.property(res.body[0],'_id','issue should have "id" property')
	assert.property(res.body[0],'issue_title','issue should have "issue_title" property')
	assert.property(res.body[0],'issue_text','issue should have "issue_text" property')
	assert.property(res.body[0],'created_by','issue should have "created_by" property')
	assert.property(res.body[0],'assigned_to','issue should have "assigned_to" property')
	assert.property(res.body[0],'open','issue should have "open" property')
	assert.property(res.body[0],'status_text','issue should have "status_text" property')
	assert.property(res.body[0],'createdAt','issue should have "createdAt" property')
	assert.property(res.body[0],'updatedAt','issue should have "updatedAt" property')
		
		})
	})
		// POST request test cases
		suite('POST Routes testing', function(){
		// You can send a POST request to /api/issues/{projectname} with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.

			test('POST / create issue with all field', function(done){ 
				// let newProject = new Project({name:'Project',issues:[]});
				let newIssue = new Issue({
					issue_title:'first_issue',
					issue_text:'issue_text',
					created_by:'user',
					assigned_to:'different user',
					open:true,
					status_text:'open'
				})
			
						chai.request(server)
						.post('/api/issues/:project')
						.send(newIssue)
						.end(function(err,res){
							assert.equal(res.status,200)
							assert.isObject(res,'Issue should be an Object')
							assert.property(res.body,'_id')
							assert.propertyVal(res.body,'issue_title','first_issue', 'issue_title should be "first_issue"')
							assert.propertyVal(res.body,'issue_text','issue_text', 'issue_text should be "issue_text"')
							assert.propertyVal(res.body,'created_by','user', 'created_by should be "user"')
							assert.propertyVal(res.body,'assigned_to','different user', 'assigned_to should be "different user"')
							assert.propertyVal(res.body,'open',true, 'open should be "true"')
							assert.propertyVal(res.body,'status_text','open', 'status_text should be "open"')
							assert.property(res.body,'createdAt')
							assert.property(res.body,'updatedAt')
							done()
					})
			})
// The POST request to /api/issues/{projectname} will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.
			test('POST / create an issue with empty filed', (done)=>{
				let newIssue = new Issue({
					issue_title:'first_issue',
					issue_text:'issue_text',
					created_by:'user'
				})
				chai.request(server)
						.post('/api/issues/:project')
						.send(newIssue)
						.end((err,res)=>{
							if(err) done(err)
							assert.equal(res.status, 200)
							assert.propertyVal(res.body,'assigned_to','','assigned_to should be empty string if not specified')
							assert.propertyVal(res.body,'status_text','open','status_text sholud "open" by deafualt')
							done()
						})
			})
	// If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
			test('POST / missing required field',(done)=>{
				let newIssue = new Issue({});
				chai.request(server)
					.post("/api/issues/:project")
					.send(newIssue)
					.end((err,res)=>{
						if(err) done(err)
						assert.equal(res.status,500)
						assert.propertyVal(res.body,'error','required field(s) missing')
						done()
					})
			})
})

});






// You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.

// You can send a GET request to /api/issues/{projectname} and filter the request by also passing along any field and value as a URL query (ie. /api/issues/{project}?open=false). You can pass one or more field/value pairs at once.

// You can send a PUT request to /api/issues/{projectname} with an _id and one or more fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.

// When the PUT request sent to /api/issues/{projectname} does not include an _id, the return value is { error: 'missing _id' }.

// When the PUT request sent to /api/issues/{projectname} does not include update fields, the return value is { error: 'no update field(s) sent', '_id': _id }. On any other error, the return value is { error: 'could not update', '_id': _id }.

// You can send a DELETE request to /api/issues/{projectname} with an _id to delete an issue. If no _id is sent, the return value is { error: 'missing _id' }. On success, the return value is { result: 'successfully deleted', '_id': _id }. On failure, the return value is { error: 'could not delete', '_id': _id }.

// All 14 functional tests are complete and passing.

