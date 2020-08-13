var express = require('express');
var app = express();
const sendmail = require('sendmail')();

app.set('port', (process.env.PORT || 5003));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/v1/api/send-email', function(req, res) {
  console.log("req.query.fromEmailId:  ", req.query.fromEmailId);
  console.log("req.query.name:  ", req.query.name);
  console.log("req.query.message:  ", req.query.message);
  console.log("req.query.toEmailId:  ", req.query.toEmailId);
  const fromEmailId = req.query.fromEmailId;
  const name = req.query.name;
  const message = req.query.message;
  const toEmailId = req.query.toEmailId;
  if(!fromEmailId || !toEmailId) {
    return res.status(400).json({ status: 400, message: "emailId is missing" });
  }
  const html = `<!DOCTYPE html>
    <html>
    <body>
    <div style="font-size: 15px;">
      <p style="font-weight: bold;">Hi, ${name}</p>
      <p>${message}</p>
    </div>
    </body>
    </html>`;
  const subject = "You have a message from sams jira bot!";
  sendmail({
    from: fromEmailId,
    to: [toEmailId],
    bcc: [],
    subject,
    html: html
  }, function (success, reply) {
    console.log("success sending email: ", success);
    return res.status(200).json({ status: 200, message: "email sent successfully" });
  }, function (err, reply) {
    console.log("error sending email: ", err);
    return res.status(500).json({ status: 400, message: "Something went wrong" });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

