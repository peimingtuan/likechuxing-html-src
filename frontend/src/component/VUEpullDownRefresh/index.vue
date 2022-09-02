<template>
    <div class="yo-scroll" :class="{'down':(state===0),'up':(state==1),refresh:(state===2),refreshok:(state===3),touch:touching}" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
        <section class="inner" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
            <header class="pull-refresh">
                <slot name="pull-refresh">
                    <span class="down-tip">继续下拉</span>
                    <span class="up-tip">松开刷新</span>
                    <span class="refresh-tip">刷新中...</span>
                    <span class="refresh-ok">刷新成功</span>
                </slot>
            </header>
            <slot>
            </slot>
            <footer class="load-more">
                <slot name="load-more">
                    <span v-show="downFlag === false">上拉加载更多</span>
                    <span v-show="downFlag === true">加载中...</span>
                </slot>
            </footer>
            <div class="nullData" v-show="dataList.noFlag">没有更多数据了</div>
        </section>
    </div>
</template>

<script>
    export default {
        props: {
            offset: {
                type: Number,
                default: 30 //默认上拉header高度
            },
            enableInfinite: {
                type: Boolean,
                default: true
            },
            enableRefresh: {
                type: Boolean,
                default: true
            },
            dataList: {
                default: false,
                required: false
            },
            onRefresh: {
                type: Function,
                default: undefined,
                required: false
            },
            onInfinite: {
                type: Function,
                default: undefined,
                require: false
            }
        },
        data() {
            return {
                top: 0,
                state: 0,
                startX: 0,
                startY: 0,
                touching: false,
                infiniteLoading: false,
                downFlag: false, //用来显示是否加载中
            }
        },
        methods: {
            touchStart(e) {
                this.startY = e.targetTouches[0].pageY;
                this.startX = e.targetTouches[0].pageX;
                this.startScroll = this.$el.scrollTop || 0;
                this.touching = true; //留着有用，不能删除
                this.dataList.noFlag = false;

                
            },
            touchMove(e) {
                if(!this.enableRefresh || this.dataList.noFlag || !this.touching) {
                    return
                }
                let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
//              if(diff > 0) e.preventDefault()
                this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)
                if(this.state === 2) { // in refreshing
                    return
                }
                if(this.top >= this.offset) {
                    this.state = 1
                } else {
                    this.state = 0
                    this.$el.querySelector('.pull-refresh').style.display = 'none';
                }
                let more = this.$el.querySelector('.load-more');
                if(more){
                	if(!this.top && this.state === 0) {
	                    more.style.display = 'block';
	                } else {
	                    more.style.display = 'none';
	                }
                }
                this.$el.querySelector('.pull-refresh').style.display = 'flex';//只有下拉刷新时的功能需求
            },
            touchEnd(e) {
                if(!this.enableRefresh) {
                    return
                }
                this.touching = false
                if(this.state === 2) { // in refreshing刷新中
                    this.state = 2
                    this.top = this.offset
                    return
                }
                if(this.top >= this.offset) { // do refresh刷新完成
                    this.refresh()
                } else { // cancel refresh
                    this.state = 0
                    this.top = 0
                }

                //用于判断滑动是否在原地 ----begin
                let endX = e.changedTouches[0].pageX,
                    endY = e.changedTouches[0].pageY,
                    dy = this.startY - endY,
                    dx = endX - this.startX;

                //如果滑动距离太短  
                if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                    console.log("滑动距离太短")
                    return;
                }
                //--------end--------
                if(!this.enableInfinite || this.infiniteLoading) {
                    return
                }
                let outerHeight = this.$el.clientHeight,
                    innerHeight = this.$el.querySelector('.inner').clientHeight,
                    scrollTop = this.$el.scrollTop,
                    ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0;
//                  if(innerHeight<outerHeight){//解决innerHeight比outHeight小的时候引起的bug
//                  	innerHeight = outerHeight+ptrHeight+50;
//                  }
                    let bottom = innerHeight - outerHeight - scrollTop - ptrHeight;
                if(bottom <= this.offset && this.state === 0) {
                    this.downFlag = true;
                    this.infinite();
                    if(this.$el.querySelector('.load-more')){
	                	this.$el.querySelector('.load-more').style.display = 'block';
	                }
                } else {
                	if(this.$el.querySelector('.load-more')){
                    this.$el.querySelector('.load-more').style.display = 'none';}
                    this.downFlag = false;
                }
            },
            refresh() {//刷新数据中
                this.state = 2;
//              this.top = 20
                this.top = this.offset;
                setTimeout(() => {
                	this.$el.querySelector('.pull-refresh').style.display = 'flex';
                    this.onRefresh(this.refreshDone);
                }, 800);
            },
            refreshDone() {//刷新完成
            	this.state = 3;//添加完成状态
//              this.state = 0
				setTimeout(() => {
                    this.top = 0
                }, 200);
                
            },

            infinite() {//加载更多
                this.infiniteLoading = true
                setTimeout(() => {
                    this.onInfinite(this.infiniteDone);
                }, 300);
            },

            infiniteDone() {
                this.infiniteLoading = false
            }
        }
    }
</script>
<style lang="less">
   .yo-scroll {
	    font-size: .12rem;
	    position: absolute;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    overflow-x: hidden;
	    overflow-y: scroll;
	    z-index: 100;
	    height: auto;
	    -webkit-overflow-scrolling: touch;
	    .inner {
	        position: absolute;
	        top: 0;
	        width: 100%;
	        height: auto;
	        transition-duration: 300ms;
	        .pull-refresh {
	            position: relative;
	            left: 0;
	            top: 0;
	            width: 100%;
	            height: .35rem;
	            display: flex;
	            display: -webkit-flex;
	            align-items: center;
	            justify-content: center;
	        }
	        .load-more {
	            height: .35rem;
	            line-height: .35rem;
	            display: flex;
	            text-align: center;
	            align-items: center;
	            justify-content: center;
	            display: none;
	        }
	        .nullData {
	            /*暂无更多数据样式*/
	            font-size: .13rem;
	            color: #999999;
	            height: 0.25rem;
	            line-height: 0.25rem;
	            text-align: center;
	        }
	        .down-tip,
	        .refresh-tip,
	        .up-tip,
	        .refresh-ok {
	            display: none;
	        }
	        .up-tip:before,
	        .refresh-tip:before,
	        .refresh-ok:before {
	            content: '';
	            display: inline-block;
	            width: 0.8rem;
	            height: 0.35rem;
	            background-size: 70% !important;
	            position: absolute;
	            top: 0; 
	            left: 20%;
	        }
	    }
	}

	.yo-scroll.touch .inner {
	    transition-duration: 0ms;
	}
	
	.yo-scroll.down .down-tip {
	    display: block;
	}
	
	.yo-scroll.up .up-tip {
	    display: block;
	}
	
	.yo-scroll.refresh .refresh-tip {
	    display: block;
	}
	.yo-scroll.refreshok .refresh-ok {
	    display: block;
	}
</style>