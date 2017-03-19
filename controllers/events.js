/**
 * Created by epiker on 2017/3/19.
 */
var db=require('./db');
var async=require('async');
exports.addEvent=function (req,res) {
    var Title=req.body.Title;
    var Description=req.body.Description;
    var starttm=req.body.starttm;
    var endtm=req.body.endtm;
    var Resources=req.body.Resources;
    var Users=req.body.Users;
    var ResourcesId=req.body.ResourcesId;
    var UsersId=req.body.UsersId;

    var sql="insert into scheduledevents (Title,Description,StartDay,StopDay,Resources,Users) VALUES ("+
        "'"+Title+"'," +
        "'"+Description+"'," +
        "'"+starttm+"'," +
        "'"+endtm+"'," +
        "'"+Resources+"'," +
        "'"+Users+"')";
    db.driver.execQuery(sql,function (err,data) {
       if(err)
       {
           console.log(err);
           res.send({error:err});
           return;
       }
       res.send({});
    });

};
exports.deleteEvent=function (req,res) {
    var Id=req.body.Id;
    var sql="delete from scheduledevents where Id='"+Id+"'";
    db.driver.execQuery(sql,function (err,data) {
        if(err)
        {
            console.log(err);
            res.send({error:err.toString()});
            return;
        }
        res.send({});
    });

};
exports.getEvents=function (req,res) {
   var sql="SELECT * FROM scheduledevents";
 /*  async.parallel(
       [
           function (callback) {
                var sql="SELECT Id,Title FROM resources";
                 db.driver.execQuery(sql,function (err,data) {
                     if(err)
                     {
                         callback(err,null);
                         return;
                     }
                     callback(null,data);
                 });
           },
           function (callback) {
               var sql="SELECT Id,Name FROM users";
               db.driver.execQuery(sql,function (err,data) {
                   if(err)
                   {
                       callback(err,null);
                       return;
                   }
                   callback(null,data);
               });
           }
       ],function (err,results) {
           if(err)
           {
               console.log(err);
               res.send({error:err});
               return;
           }
           var ResourcesMap={};
           var len=results[0].length;
           for(var i=0;i<len;i++)
           {
               ResourcesMap[results[0][i].Id]=results[0][i].Title;
           }
       }


   );*/
   db.driver.execQuery(sql,function (err,data) {
      if(err)
      {
          console.log(err);
          res.send({error:err});
          return;
      }
      res.send(data);
   });
};