module.exports= {
	//REST API를 이용한 url db접근 성공시 respond에 return
	successRes : function(res, msg, obj) {
		res.json({
			result : true,
			message : msg,
			object : obj
		});
	}
}
