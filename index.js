const express = require('express');

const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { promisify } = require('util');
const sgMail = require('@sendgrid/mail');
const docId = '1ZOefJaeyfPHzpx_b80LCLD0UmcM4S9NwyOdYsLIn40g'
const sendGridKey = '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'
const worksheetIndex = 0

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugTracker.json')

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/', async (req, res) => {
    console.log(req.body);

    try {
        const doc = new GoogleSpreadsheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)(
            {
                name: req.body.name,
                email: req.body.email,
                userAgent: req.body.userAgent,
                userDate: req.body.userDate,
                issueType: req.body.issueType,
                source: req.query.source || 'direct'
            })


 
        console.log(req.body.issueType);
        
        if (req.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey);
      

            const msg = {
                to: 'marcos.ribeiro@health4pet.com',
                from: 'marcos.rib.sousa@gmail.com',
                subject: 'BUG critico reportado',
                text: `O usuário ${req.body.name} reportou um problema`,
                html: `O usuário ${req.body.name} reportou um problema`,
            };
             await sgMail.send(msg);
          console.log('aqui');
          
        }
        res.send('Bug reportado com sucesso!')
    } catch (err) {
        res.send('Erro ao enviar fomrulário')
    }

})

app.listen(3000)