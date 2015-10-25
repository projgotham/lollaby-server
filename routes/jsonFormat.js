module.exports= {
	//REST API를 이용한 url db접근 성공시 respond에 return
	successRes : function(res, msg, obj) {
		res.json({
			result : true,
			message : msg,
			object : obj
		});
	},
	//REST API를 이용한 url db접근 실패시 respond에 return
	failRes : function(res, msg, obj) {
		res.json({
			result : false,
			message : msg,
			object : obj
		});
	}
}
