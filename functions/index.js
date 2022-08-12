const functions = require("firebase-functions");
const ofx = require('ofx');
const cors = require('cors')({ origin: true });
const moment = require('moment');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.parseOfx = functions.region('southamerica-east1').https.onRequest((request, response) => {

  // functions.logger.info("Hello logs!", { structuredData: true });
  cors(request, response, () => {
    // functions.logger.info("Body", request.body);

    const ofxData = ofx.parse(request.body);

    const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
    // const accountId = statementResponse.BANKACCTFROM.ACCTID;
    const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
    const transactions = transactionStatement.map((t) => {

      const momentDate = moment([
        `${t.DTPOSTED}`.substring(0, 4),
        Number(`${t.DTPOSTED}`.substring(4, 6)) - 1,
        `${t.DTPOSTED}`.substring(6, 8)]
      );
      const amount = Number(t.TRNAMT);
      const inflow = amount > 0 ? amount : 0;
      const outflow = amount < 0 ? -amount : 0;

      return {
        date: momentDate.format('YYYY-MM-DD'),
        memo: t.MEMO,
        outflow,
        inflow,
        cleared: false,
        bankCode: t.FITID
      }
    });
    response.send(transactions);
  })


});