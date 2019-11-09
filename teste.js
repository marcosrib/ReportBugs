const docId = '1ZOefJaeyfPHzpx_b80LCLD0UmcM4S9NwyOdYsLIn40g'
const worksheetIndex = 0

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugTracker.json')
const { promisify } = require('util');



const doc = new GoogleSpreadsheet(docId)
doc.useServiceAccountAuth(credentials, (error) => {
    if (error) {
        console.log('erro');
    } else {
        console.log('sucesso');
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[worksheetIndex]
            worksheet.addRow({ name: req.body.name, email: req.body.email }, erro => {
                res.send(req.body)
            })
        })
    }
})


