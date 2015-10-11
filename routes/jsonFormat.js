module.exports= {
	successRes : function(res, msg, obj) {
		res.json({
			result : true,
			message : msg,
			object : obj
		});
	}
}
