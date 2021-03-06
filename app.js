const express      = require('express'),
      exhbs        = require('express-handlebars'),
      cookieParser = require('cookie-parser'),
      session      = require('express-session'),
      bodyParser   = require('body-parser'),
      mysql        = require('mysql'),
      connectionPv = require('connection-provider'),
      compression  = require('compression'),
      uuid         = require('node-uuid'),
      lodash       = require('lodash'),
      app          = express();

const SignupDataService                 = require('./data_services/signupDataService');
const SetupQuestionnaireDataService     = require('./data_services/setupQuestionnaireDataService');
const LoginDataService                  = require('./data_services/loginDataService');
const ViewQuestionnnaireDataService     = require('./data_services/viewQuestionnaireDataService');
const QuestionDataService               = require('./data_services/questionDataService');
const AllocateQuestionnaireDataService  = require('./data_services/allocateQuestionnaireDataService');
const AnswerDataService                 = require('./data_services/answerDataService');

const signup             = require('./routes/signup');
const setupQuestionnaire = require('./routes/setupQuestionnaire');
const login              = require('./routes/login');
const viewQuestionnaire  = require('./routes/viewQuestionnaire');
const answerQuestionnaire  = require('./routes/answers');
const questions          = require('./routes/questions');
const allocate           = require('./routes/allocateQuestionnaire');
const router             = require('./routes/router');

const dbOptions = {
  host      : 'localhost',
  user      : 'admin',
  password  : 'password',
  port      : 3306,
  database  : 'the_hub'
};

const serviceSetupCallBack = function (connection) {
  return {
    signupDataService                 : new SignupDataService(connection),
    setupQuestionnaireDataService     : new SetupQuestionnaireDataService(connection),
    loginDataService                  : new LoginDataService(connection),
    viewQuestionnnaireDataService     : new ViewQuestionnnaireDataService(connection),
    questionDataService               : new QuestionDataService(connection),
    allocateQuestionnaireDataService  : new AllocateQuestionnaireDataService(connection),
    answerDataService                 : new AnswerDataService(connection)
  }
};

app.use(connectionPv(dbOptions, serviceSetupCallBack));
app.use(cookieParser('shhhh, very secret'));
app.use(session({ secret : 'keyboard cat', cookie :{ maxAge : 3600000 }, resave : true, saveUninitialized : true }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use(compression());
app.engine('handlebars', exhbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.get('/signup', router.signup);
app.post('/signup/add',signup.add);
app.get('/', router.login);
app.post('/login', login.userLogin);
app.get('/dashboard', router.dashboard);
app.get('/questionnaire/setup/step1', router.questionnaire);
app.post('/questionnaire/setup/step1/', setupQuestionnaire.create);
app.get('/questionnaire/setup/step2/:id', setupQuestionnaire.show);
app.post('/questionnaire/setup/step2/:id', setupQuestionnaire.linkMetricToQuestionnaire);
app.post('/setup-questionnaire-step-2/addMetricToMetricTable/:id', setupQuestionnaire.addMetricToMetricTable);
app.get('/questionnaire/allocate/:id', allocate.show);
app.post('/questionnaire/allocate/down/:id',allocate.allocateToSubEntity);
app.post('/view-questionnaire/create', setupQuestionnaire.create);
app.post('/questionnaire/allocate/:id',allocate.allocate);
app.get('/view-questionnaire', viewQuestionnaire.show);
app.get('/answer-questionnaire', answerQuestionnaire.show);
app.get('/questionnaire/questions/view/:id',questions.show);
app.get('/questionnaire/questions/:id',answerQuestionnaire.showQuestions);
app.post('/questionnaire/questions/view/:id',setupQuestionnaire.linkMetricToQuestionnaire);
app.post('/questionnaire-metric/answer/:id',answerQuestionnaire.answers)
app.get('/logout', router.logout);

const port = process.env.PORT || 8080;
const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('App running on http://%s:%s', host, port);
});
