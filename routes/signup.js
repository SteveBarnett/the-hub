var Promise = require('bluebird');

exports.add = function (req, res, next) {
    req.getServices()
      .then(function(services){
        const input = JSON.parse(JSON.stringify(req.body));
        const entity = {
            name  : input.name,
            logo  : input.logo,
            address : input.address
          };

        const user = {
            email :  input.email,
            role  :  'admin',
            status  : 'created',
            password  : 'password',
            firstName : input.firstName,
            lastName  : input.lastName,
            entity_id :
        };
        const signupDataService = services.signupDataService;
        Promise.join(addEntity(entity), addUser(user))
          .then(function(entityResults, userResults){
              res.redirect('/setup-questionnaire');
          })
            .catch(function(err){
                next(err);
    });
});
};
