const EmployeeModel = require('./../model/Employee');

function create(req, res, next) {
  const payload = req.body;

  //validate payload
  _validatePayload(payload, (validationErr) => {
    if (validationErr) {
      return next(validationErr);
    }
    const employeeObj = new EmployeeModel({
      firstName: payload.firstName,
      lastName: payload.lastName,
      age: payload.age,
      designation: payload.designation,
      address: payload.address,
    });

    employeeObj.save((err, savedRecord) => {
      if (err) {
        const errorObj = {
          message: err.message,
          statusCode: 500
        };
        return next(errorObj);
      }

      res.setHeader('Content-type', 'application/json');
      res.statusCode = 201;
      res.end(JSON.stringify(savedRecord));
    });
  });
};

function get(req, res, next) {
  const pageNumber = req.get('pageNumber');
  const sortField = req.get('field');
  const sortValue = req.get('value');
  const pageSize = 10;
  const skipCount = pageNumber > 0 ? ( ( pageNumber - 1 ) * pageSize ) : 0;
  const sortObj = {
    [sortField]: sortValue,
  }

  let totalCount;

  EmployeeModel.find({}).countDocuments((error, count) => {
    if (error) {
      const errorObj = {
        message: err.message,
        statusCode: 500
      };
      return next(errorObj);
    }
    totalCount = count;
  });

  EmployeeModel.find({},(error, employees) => {
    if (error) {
      const errorObj = {
        message: error.message,
        statusCode: 500
      };
      return next(errorObj);
    }
    const data = {
      data: employees,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
    };
    res.setHeader('Content-type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(data));
  })
  .skip(skipCount)
  .sort(sortObj)
  .limit(pageSize);
};

function update(req, res, next) {
  const id = req.params.id;
  const payload = req.body;
  _validatePayload(payload, (validationErr) => {
    if (validationErr) {
      return next(validationErr);
    }
    EmployeeModel.findById(id, (err, employee) => {
      if (err) {
        const errorObj = {
          message: err.message,
          statusCode: 500
        };
        return next(errorObj);
      }

      if (!employee) {
        res.setHeader('Content-type', 'application/text');
        res.statusCode = 400;
        res.end('Record does not exist');
        return;
      }

      employee.firstName = payload.firstName
      employee.lastName = payload.lastName
      employee.age = payload.age
      employee.address = payload.address
      employee.designation = payload.designation

      if (employee.isModified()) {
        employee.increment();
      }

      employee.save((err, updatedRecord) => {
        if (err) {
          const errorObj = {
            message: err.message,
            statusCode: 500
          };
          return next(errorObj);
        }
        res.setHeader('Content-type', 'application/text');
        res.statusCode = 200;
        res.end('Record updated successfully');
      });
    })
  })

};

function remove(req, res, next) {
  const id = req.params.id;
  EmployeeModel.findById(id, (err, employee) => {
    if (err) {
      const errorObj = {
        message: err.message,
        statusCode: 500
      };
      return next(errorObj);
    }
    if (!employee) {
      res.setHeader('Content-type', 'application/text');
      res.statusCode = 400;
      res.end('Record does not exist');
      return;
    }
    employee.remove((err) => {
      if (err) {
        const errorObj = {
          message: err.message,
          statusCode: 500
        };
        return next(errorObj);
      }
      res.setHeader('Content-type', 'application/text');
      res.statusCode = 200;
      res.end('Record deleted successfully')
    });
  })
};

module.exports = {
  create,
  get,
  update,
  remove
};

function _validatePayload(payload, callback) {
  if (!payload.firstName) {
    const errorObj = {
      message: 'The first name is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }
  if (!payload.lastName) {
    const errorObj = {
      message: 'The last name is missing',
      statusCode: 400
    };
    return callback(errorObj);

  }
  if (!payload.age) {
    const errorObj = {
      message: 'The age is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }
  if (!payload.designation) {
    const errorObj = {
      message: 'The designation is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }

  return callback();
}

function getAllEmployee(options) {
  const { pageSize, pageNumber, sortObj } = options;
  EmployeeModel.find({})
    .skip((pageSize - pageNumber) * pageSize)
    .sort(sortObj)
    .limit(pageSize).exec((err, employees) => {
      if (err) {
        const errorObj = {
          message: err.message,
          statusCode: 500
        };
        return errorObj;
      }
      return employees;
    });
}