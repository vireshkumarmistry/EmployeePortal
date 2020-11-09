const EmployeeService = require('../services/EmployeeService');

module.exports = (app) => {

  // return list of employees
  // pass a paramerter in header such as pageNumber: 1, sortField: 'firstName', value: 1 or -1
  app.get('/employee',(req, res, next) => {
    EmployeeService.get(req, res, (err) => {
      if(err) {
        console.log(err);
        return next(err);
      }

      return next();
    })
  })

  // create a employee
  app.post('/employee', (req, res, next) => {
    EmployeeService.create(req, res, (err) => {
      if(err) {
        console.log(err);
        return next(err);
      }

      return next();
    });
  });

  // update a employee
  app.put('/employee/:id', (req, res, next) => {
    EmployeeService.update(req, res, (err) => {
      if(err) {
        console.log(err);
        return next(err);
      }

      return next();
    })
  })

  // delete a employee
  app.delete('/employee/:id', (req, res, next) => {
    EmployeeService.remove(req, res, (err) => {
      if(err) {
        console.log(err);
        return next(err);
      }

      return next();
    })
  })
};