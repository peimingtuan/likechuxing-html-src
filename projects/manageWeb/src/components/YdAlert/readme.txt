
//展示Toast
store.dispatch('YdAlert/show',{
  mold:'toast',
  msg:'要显示的信息'
});

//展示tips
store.dispatch('YdAlert/show',{
  mold:'tips',
  msg:'要显示的信息'
});

//展示一个按钮提示框
store.dispatch('YdAlert/show',{
  mold:'alert',
  title:'提示标题',//选填
  msg:'提示内容',//选填
  confirmButtonText:'确定',//选填，按钮显示文字，default：'确定'，
  confirmButtonCallback:function(){},//选填，按钮点击完回调函数
});

//展示两个按钮的提示框
store.dispatch('YdAlert/show',{
  mold:'alert',
  title:'提示标题',//选填
  msg:'提示内容',//选填
  confirmButtonText:'确定',//选填，按钮显示文字，default：'确定'，
  confirmButtonCallback:function(){},//选填，按钮点击完回调函数
  cancelButtonText:'取消',//选填，按钮显示文字，default：'取消'，
  cancelButtonCallback:function(){}//选填，按钮点击完回调函数
});
