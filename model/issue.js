const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = new Schema(
  {
    issue_title: { type: String, required: true , default: ""},
    issue_text: { type: String, required: true , default: ""},
    created_by: { type: String, required: true, default: "" },
    assigned_to: { type: String, default: "" },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: "" },
  },
	{timestamps:{createdAt:"created_on",updatedAt:"updated_on"}}
);

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = Issue;
