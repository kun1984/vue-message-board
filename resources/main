window.onload=function(){
	new Vue({
		el:"#box",
		data:{
			myData:[],
			userName:'',
			age:'',
			nowIndex:-100,
			title:'确认删除么？'
		},
		methods:{
			add:function(){
				this.myData.push({
					name:this.userName,
					age:this.age
				});
				this.userName ='';
				this.age='';
			},
			deleteClick:function(n){
				this.nowIndex = n;
				this.title='确认删除么？'
			},
			deleteAllClick:function(n){
				this.nowIndex = -2;
				this.title='确认删除全部么？'
			},
			deleteItem:function(n){
				if(n==-2){
					this.title ='确认删除全部么？',
					this.myData=[];
				}else{
					this.myData.splice(n,1);
				}
			}
		}
	});
};
