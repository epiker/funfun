/**
 * Created by epiker on 2017/3/12.
 */
var orm = require('orm');
var config = require('../config');
//orm.settings.set("connection.reconnect",false);
var db = orm.connect(config.statistic_db_url);

db.on('connect',function (err)
{
    if (err) {
        console.log("sss"+err);
        throw err;
    }
});
db.on('error',function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        db = orm.connect(config.statistic_db_url);                      // lost due to either server restart, or a
    }else{
        console.log("123");
        throw err;
    }
});
module.exports=db;