/**
 * Created by garvey on 2017/7/21.
 */
function toast(msg){
	if(msg!=''){
		document.querySelector('#toast-msg').innerHTML=msg;
		document.querySelector('#toast-con').style.display='block';
		setTimeout(function(){
			document.querySelector('#toast-con').style.display='none';
		},2500)
	}
}

export default toast