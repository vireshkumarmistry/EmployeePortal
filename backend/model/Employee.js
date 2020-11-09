const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    designation: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    }
  },
  {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at'
    }
  }
);

const EmployeeModel = mongoose.model('Employee', EmployeeSchema);
module.exports = EmployeeModel;