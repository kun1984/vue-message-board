Date.prototype.format = function(fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
window.onload = function() {
    var app = new Vue({
        el: "#box",
        data: {
            myData: [],
            author: '',
            content: '',
            deleteId: -1,
            title: '确认删除么？'
        },
        methods: {
            add: function() {
            	var that = this;
			    var data = {};
			    data.author = this.author;
			    data.content = this.content;
			    data.date=new Date().format("yyyy-MM-dd hh:mm:ss")
			    $.ajax({
			        url: "/messages",
			        type: 'POST',
			        contentType: 'application/json',
			        data: JSON.stringify(data),
			        success:function(id){
			        	that.myData.unshift({
		                    author: data.author,
		                    content: data.content,
		                    date:data.date,
		                    id:id
		                });
			        },
			        error:function(){
			        }
			    });
                this.author = '';
                this.content = '';
            },
            deleteClick: function(e) {
            	this.deleteId = $(e.target).attr("id");
                this.nowIndex = -1;
                this.title = '确认删除么？'
            },
            deleteAllClick: function(n) {
                this.nowIndex = -2;
                this.title = '确认删除全部么？'
            },
            deleteItem: function(n) {
            	var that = this;
                if (n == -2) {
                    this.title = '确认删除全部么？',
	                $.ajax({
				        url: "/messages",
				        type: 'delete',
				        contentType: 'application/json',
				        success:function(resp){
				        	 that.myData = [];
				        },
				        error:function(){
				        }
				    });
                       
                } else {
                	$.ajax({
				        url: "/messages/"+this.deleteId,
				        type: 'delete',
				        contentType: 'application/json',
				        success:function(resp){
				        	 that.myData = resp;
				        },
				        error:function(){
				        }
				    });
                    
                }
            }
        }
    });


    $.ajax({
        url: "/messages",
        type: 'get',
        contentType: 'application/json',
        success:function(resp){
        	for(var i = 0;i<resp.length;i++){
        		var data = resp[i];
        		var date = resp[i].date;
        		app.$data.myData.push({
	                author: data.author,
	                content: data.content,
	                id:data.id,
	                date:date
	            });
        	}
        }
 
    });

};



