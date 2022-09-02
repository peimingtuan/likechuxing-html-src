//调用：
<StepShow :step="['待充电','充电中','待处理','已完成']" :stepNow="2"></StepShow>

step:每一步描述的数组，必填
stepNow:当前激活到哪一步，范围是0到step.length
