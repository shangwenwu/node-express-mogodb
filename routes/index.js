var express = require('express');
var router  = express.Router();
var crypto  = require('crypto');
var User    = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { 
  		title: '主页',
  		user:req.session.user,
  		success:req.flash('success').toString(),
  		error:req.flash('error').toString()
  	});
});

router.get('/reg', function(req, res, next) {
  	res.render('reg', { 
  		title: '注册' ,
  		user:req.session.user,
  		success:req.flash('success').toString(),
  		error:req.flash('error').toString()
  	});
});

router.post('/reg', function(req, res, next) {
	var name        = req.body.name,
	    password    = req.body.password,
	    password_re = req.body['password_repeat'];
	if(password != password_re){
		req.flash('error','两次输入的密码不一致！');
		return res.redirect('/reg'); //返回注册页
	}
	var md5      = crypto.createHash('md5'),
	    password = md5.update(req.body.password).digest('hex');
	var newUser  = new User({
		name:req.body.name,
		password:password,
		email:req.body.email
	});
	//检查用户名是否已经存在 （与模型交互）
	User.get(newUser.name,function(err,user){
		if(user){ //数据库中查到的情况下
			req.flash('error','用户名已经存在！');
			return res.redirect('/reg');
		}
		
		//如果不存在则新增用户
		newUser.save(function(err,user){
			if(err){ //新增错误时
				req.flash('error',err);
				return res.redirect('/reg');
			}
			req.session.user = user; //用户信息存入session
			req.flash('success','注册成功！');
			res.redirect('/');//成功后返回主页
		});
	});
});

router.get('/login', function(req, res, next) {
  	res.render('login', { 
  		title: '登录' ,
  		user:req.session.user,
  		success:req.flash('success').toString(),
  		error:req.flash('error').toString()
  	});
});

router.post('/login', function(req, res, next) {

});

router.get('/post', function(req, res, next) {
  	res.render('post', { title: '发表' });
});

router.post('/post', function(req, res, next) {

});

router.get('/logout', function(req, res, next) {

});


router.get('/username', function(req, res, next) {
  res.send('respond with a resource ddwdwdwddwwdwdw');
});

module.exports = router;
