var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

//app.use(express.static('public'));
app.use(bodyParser.json());

//set template engine
app.set('view engine', 'ejs')

app.get('/', function(req,res){
    res.render("index");
})

app.get('/update', function(req,res){
    res.render("update_form");
})

app.post('/update', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'UPDATE salesforce.Contact SET Phone = $1, HomePhone = $1, MobilePhone = $1 WHERE LOWER(FirstName) = LOWER($2) AND LOWER(LastName) = LOWER($3) AND LOWER(Email) = LOWER($4)',
            [req.body.phone.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim()],
            function(err, result) {
                if (err) {
                    return console.error(err);
                }
                else {
                    done();
                    res.json(result);
                }
            }
        );
    });
});

app.get('/delete', function(req,res){
    res.render("delete_form");
})

app.post('/delete', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'DELETE FROM salesforce.Contact WHERE LOWER(Email) = LOWER($1)',
            [req.body.email.trim()],
            function(err, result) {
                if (err) {
                    return console.error(err);
                }
                else {
                    done();
                    res.json(result);
                }
            }
        );
    });
});


app.get('/insert', function(req,res){
    res.render("insert_form");
})

app.post('/insert', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query('INSERT INTO salesforce.Contact (Phone, MobilePhone, FirstName, LastName, Email) VALUES ($1, $2, $3, $4, $5)',
                  [req.body.phone.trim(), req.body.phone.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim()],
                  function(err, result) {
                    done();
                    if (err) {
                        res.status(400).json({error: err.message});
                    }
                    else {
                       
                        res.json(result);
                    }
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
