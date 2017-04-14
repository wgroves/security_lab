/********************************************************************************/
/*										*/
/*		profile.js							*/
/*										*/
/*	Handle profile pages							*/
/*										*/
/********************************************************************************/


var db = require("./database.js");




/********************************************************************************/
/*										*/
/*	Display profile request 						*/
/*										*/
/********************************************************************************/

function displayProfile(req,res,next)
{
   displayProfile0(req,res,next,false);
}




function displayProfile0(req,res,next,succ)
{
   var userid = req.session.userId;

//    var q = "SELECT U.firstName, U.lastName, P.ssn, P.dob, P.address, P.bankAcc, P.bankRouting";
//    q += " FROM User U, Profile P";
//    q += " WHERE U.userId = P.userId AND U.userId = " + userid;
   
   var sql = "SELECT U.firstName, U.lastName, P.ssn, P.dob, P.address, P.bankAcc, P.bankRouting";
   sql += " FROM User U, Profile P";
   sql += " WHERE U.userId = P.userId AND U.userId = $1";
   
   var q = db.query(sql, [userid], function(e1,d1) {
      displayProfile1(req,res,next,succ,e1,d1);
   });

   //db.query(q,function (e1,d1) { displayProfile1(req,res,next,succ,e1,d1); } );
}




function displayProfile1(req,res,next,succ,err,data)
{
   if (err != null) return next(err);

   var doc = data.rows[0];
   doc.userId = req.session.userId;
   if (succ) doc.updateSuccess = true;
   
   return res.render("profile",doc);
}





/********************************************************************************/
/*										*/
/*	Handle profile update							*/
/*										*/
/********************************************************************************/

function handleProfileUpdate(req,res,next)
{
   var firstname = req.body.firstName;
   var lastname = req.body.lastName;
   var ssn = req.body.ssn;
   var dob = req.body.dob;
   var address = req.body.address;
   var bankAcc = req.body.bankAcc;
   var bankRouting = req.body.bankRouting;

   var regexPattern = /([0-9]+)+\#/;
   // Allow only numbers with a suffix of the letter #, for example: 'XXXXXX#'
   var testComplyWithRequirements = regexPattern.test(bankRouting);
   if (testComplyWithRequirements !== true) {
      var doc = { updateError: "Bank Routing number does not comply with requirements for format specified" };
      return res.render("profile", doc);
    }

   var userId = req.session.userId;

//    var q = "UPDATE User SET firstName = '" + firstname + "', lastName = '" + lastname + "'" +
//       " WHERE userId = " + userId;
   
   var sql = "UPDATE User SET firstName = $1, lastName = $2 WHERE userId = $3;"
   var q = db.query(sql, [firstname, lastname, userId], function(e1,d1) {
      handleProfileUpdate1(req,res,next,e1,d1);
   });
   
   //db.query(q,function (e1,d1) { handleProfileUpdate1(req,res,next,e1,d1); } );
}



function handleProfileUpdate1(req,res,next,err,data)
{
   if (err != null) return next(err);

   var ssn = req.body.ssn;
   var dob = req.body.dob;
   var address = req.body.address;
   var bankAcc = req.body.bankAcc;
   var bankRouting = req.body.bankRouting;

//    var q = "UPDATE Profile SET ssn = '" + ssn + "', dob = '" + dob + "', address = '" +
//       address + "', bankAcc = '" + bankAcc + "', bankRouting = '" + bankRouting + "'" +
//       " WHERE userId = " + req.session.userId;
   var sql = "UPDATE PROFILE SET ssn = $1, dob = $2, address = $3, bankAcc = $4, bankRouting = $5 WHERE userId = $6;"
   var q = db.query(sql, [ssn, dob, address, bankAcc, bankRouting, req.session.userId], function(e1, d1) {
      handleProfileUpdate2(req,res,next,e1,d1);
   });
   
   //db.query(q,function(e1,d1) { handleProfileUpdate2(req,res,next,e1,d1); } );
}



function handleProfileUpdate2(req,res,next,err,data)
{
   if (err != null) return next(err);

   displayProfile0(req,res,next,true);
}




/********************************************************************************/
/*										*/
/*	Exports 								*/
/*										*/
/********************************************************************************/

exports.displayProfile = displayProfile;
exports.handleProfileUpdate = handleProfileUpdate;




/* end of profile.js */
