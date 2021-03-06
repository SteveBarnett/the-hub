exports.show = function (req, res, next) {
   req.getServices()
       .then(function(services){
           const viewQuestionnnaireDataService = services.viewQuestionnnaireDataService;
           var id = req.session.entity_id;
           viewQuestionnnaireDataService.showQuestionnaires(id)
               .then(function(questionnaire){
                   res.render('view-questionnaire', {
                       questionnaire : questionnaire
                   });
               });
       })
       .catch(function(err){
           next(err);
       });
};
