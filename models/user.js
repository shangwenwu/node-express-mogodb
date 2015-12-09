var mongodb = require('./db');
function User(user){
	this.name     = user.name;
	this.password = user.password;
	this.email    = user.email;
}
module.exports = User;
//存储用户信息
//将来被控制器调用
//注意的是callback的参数（arr,data）与数据库将来增删改查等操作的（err,data）一致
//必需遵守的规定
User.prototype.save = function(callback){ 
	//要存入数据库的用户文档
	var user = {  
		name     : this.name,     // 相当于数据表的字段
		password : this.password, // 相当于数据表的字段
		email    : this.email     // 相当于数据表的字段
	}
	//打开数据库
	mongodb.open(function(err,db){
		if(err){ //数据库打开失败
			return callback(err);
		}
		//查询数据表
		//'users'也就是数据表名
		//创建一个表或查询一个表，写到第一个参数
		db.collection('users',function(err,collection){
			if(err){ //查表失败
				mongodb.close();
				return callback(err);
			}
			//user：要插入的数据
			collection.insert(user,{
				safe:true
			},function(err,user){
				mongodb.close();
				if(err){ //插入数据失败
					return callback(err);
				}
				callback(null,user[0]);//成功 err为null,返回存储后的用户文档
			})
		});
	});
};
User.get = function(name,callback){ 
	//打开数据库
	mongodb.open(function(err,db){
		if(err){ //数据库打开失败
			return callback(err);
		}
		//查询数据表
		//'users'也就是数据表名
		//创建一个表或查询一个表，写到第一个参数
		db.collection('users',function(err,collection){
			if(err){ //查表失败
				mongodb.close();
				return callback(err);
			}
			//查找用户名name键，值为name的一个文档
			collection.findOne({
				name:name //注意这里的key是一个数据表中的字段
			},function(err,user){
				mongodb.close();
				if(err){ //查找数据失败
					return callback(err);
				}
				callback(null,user);//成功 err为null,返回存储后的用户文档
			})
		});
	});
};