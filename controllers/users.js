/**
 * Created by epiker on 2017/3/19.
 */
var db=require('./db');
exports.getUsers=function (req,res) {
    var sql="SELECT Id,Name FROM users";
    db.driver.execQuery(sql,function (err,data) {
        if(err)
        {
            console.log(err);
            res.send(err);
            return;
        }
        res.send(data);
    });
};