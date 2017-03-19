/**
 * Created by epiker on 2017/3/19.
 */
var express = require('express');
var router=express.Router();
var OAuth=require('wechat-oauth');
var client = new OAuth('app_id', 'app_secret');
router.get('/login',function (req,res) {
    var url = client.getAuthorizeURL('http://' + domain + '/weixin/callback','','snsapi_userinfo');
    res.redirect(url)
});
router.get('/weixin/callback', function(req, res) {
    console.log('----weixin callback -----')
    var code = req.query.code;
    var User = req.model.UserModel;

    client.getAccessToken(code, function (err, result) {
        console.dir(err)
        console.dir(result)
        var accessToken = result.data.access_token;
        var openid = result.data.openid;

        console.log('token=' + accessToken);
        console.log('openid=' + openid);

        /*User.find_by_openid(openid, function(err, user){
            console.log('微信回调后，User.find_by_openid(openid) 返回的user = ' + user)
            if(err || user == null){
                console.log('user is not exist.')
                client.getUser(openid, function (err, result) {
                    console.log('use weixin api get user: '+ err)
                    console.log(result)
                    var oauth_user = result;

                    var _user = new User(oauth_user);
                    _user.username = oauth_user.nickname;
                    _user.nickname = oauth_user.nickname;

                    _user.save(function(err, user) {
                        if (err) {
                            console.log('User save error ....' + err);
                        } else {
                            console.log('User save sucess ....' + err);
                            req.session.current_user = void 0;
                            res.redirect('/user/' + user._id + '/verify');
                        }
                    });

                });
            }else{
                console.log('根据openid查询，用户已经存在')
                // if phone_number exist,go home page
                if(user.is_valid == true){
                    req.session.current_user = user;
                    res.redirect('/mobile')
                }else{
                    //if phone_number exist,go to user detail page to fill it
                    req.session.current_user = void 0;
                    res.redirect('/users/' + user._id + '/verify');
                }
            }
        });*/
    });
});
module.exports=router;