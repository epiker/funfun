/**
 * Created by epiker on 2017/3/12.
 */
var db=require('./db');
exports.getResources=function (req,res) {
    var sql="SELECT Id,Title,Tags FROM resources";
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
exports.showEditResource=function (req,res) {
   // console.log(req.params.Id);
    var Id=req.params.Id;
    if(typeof (Id) =='undefined')
    {
        res.send("Id not found");
        return;
    }
    var sql="SELECT * FROM resources where Id='"+Id+"'";
    db.driver.execQuery(sql,function (err,data) {
        if(err)
        {
            console.log(err);
            res.send(err);
            return;
        }
        data=data[0];
        res.render('details',{title:"我的资源详情",
            Id:data.Id,
            Title:data.Title,
            Description:data.Description,
            Tags:data.Tags,
            Count:data.Count,
            CostPrice:data.CostPrice,
            CreateTime:data.CreateTime
        });
    });

};
exports.getResourcesDetail=function(req,res)
{
    var Id=req.params.Id;
    if(typeof (Id) =='undefined')
    {
        res.send("Id not found");
        return;
    }
    var sql="SELECT * FROM resources where Id='"+id+"'";
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