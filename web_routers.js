/**
 * Created by epiker on 2017/3/12.
 */
var express = require('express');
var router=express.Router();

var index=require('./controllers/index');
var resources=require('./controllers/resources');
var users=require('./controllers/users');
var events=require('./controllers/events');
router.get('/',index.showHome);
router.get('/change',index.getChange);
router.get('/home',index.showHome);
router.post('/ask_for_resources',resources.getResources);
router.post('/ask_for_users',users.getUsers);
router.get('/resources/:Id',resources.showEditResource);
router.post('/resources/:Id',resources.getResourcesDetail);
router.post('/insertEvent',events.addEvent);
router.post('/ask_for_events',events.getEvents);
router.post('/delete_event',events.deleteEvent);
module.exports = router;