const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = new Schema(
  {
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: "" },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: "open" },
  },
	{timestamps:{createdAt:"created_on",updatedAt:"updated_on"}}
);

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = Issue;
