/**
 * Created by Administrator on 2018/7/13.
 */
require('../css/public.css')
require('../css/prepareWork/photoshow.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//接收URL参数
var item_id = FoundationTools.getUrlParam('item_id');
var photo = [],//图片存储
    text = [];//文字叙述
switch (Number(item_id)) {
    case 2://GPS照片存储
        photo = [require("../image/prepareWork/show/gps.png")];
        text = ["1、需携带安装工具（剥线钳、螺丝刀、扎带、胶带、扳手、翘板、壁纸刀、电笔等）", "2、拆卸车内挡板需用翘板等专用工具，拆卸过程中不能留下痕迹。", "3、接头位置胶带缠好不能铜线裸露，安装测试完毕各线束需扎带捆绑放入挡板内。", "4、GPS安装好时需要测试，定位系统、断油电是否正常使用。"];
        break;
    case 3://GPS照片存储
        photo = [require("../image/prepareWork/show/gps.png")];
        text = ["1、需携带安装工具（剥线钳、螺丝刀、扎带、胶带、扳手、翘板、壁纸刀、电笔等）", "2、拆卸车内挡板需用翘板等专用工具，拆卸过程中不能留下痕迹。", "3、接头位置胶带缠好不能铜线裸露，安装测试完毕各线束需扎带捆绑放入挡板内。", "4、GPS安装好时需要测试，定位系统、断油电是否正常使用。"];
        break;
    case 4://车机照片存储
        photo = [require("../image/prepareWork/show/qube.png")];
        text = ["1、需携带安装工具(剥线钳、螺丝刀、扎带、胶带、扳手、翘板、壁纸刀、电笔等)", "2、按照车机商给的示意图测试各个线路连接是否准确。", "3、开始装车机接各线束前需将电瓶负级摘掉，以防联电短路。", "4、拆卸车内挡板需用翘板等专用工具，拆卸过程中不能留下痕迹。", "5、接头位置胶带缠好不能铜线裸露，安装测试完毕后各线束需扎带捆绑放入挡板内。", "6、车机线路安装完时先测试一下，开 关门、定位、断油 电、鸣笛 闪灯、油量是否正常。"];
        break;
    case 5://雷达照片存储
        photo = [require("../image/prepareWork/show/radar1.png"), require("../image/prepareWork/show/radar2.png"), require("../image/prepareWork/show/radar3.png")];
        text = ["1、前保险杠在左右90度处打倒车雷达感应器安装孔 。后保险杠左右90度处和中间对称平均距离打4个倒车雷达感应器安装孔（打孔需注意安装孔的大小适宜）。", "2、倒车雷达显示器放置于主驾中控台左前方处（安装完需测试每个探头是否 感应正常、显示器显示是否正常 、报警喇叭提示音是否正常）"];
        break;
    case 7://夹钥匙照片存储
        photo = [require("../image/prepareWork/show/pinkey.png")];
        text = ["1、需携带工具（8寸胡桃钳、包塑钢丝、铝扣）", "2、钢丝长度40cm，固定位置需放在雨刷器开关末端，钢丝一端不能超出铝扣之外。", "3、胡桃钳夹铝扣时需上中下左右夹死以免后期铝扣脱落"];
        break;
    case 8://刷车贴照片存储
        photo = [require("../image/prepareWork/show/brushes1.png"), require("../image/prepareWork/show/brushes2.png")];
        text = ["1、需携带车贴工具（油墨、开油水、丝网、洗网水、刮板、纸巾、手套、口罩）", "2、油墨及开油水的比例10：1，调拌均匀成拉丝状态（搅拌尽量用调漆桶避免杂质掺入）", "3、中途过程中丝网及刮板需清洁干净，不能留有杂质（下班需清洁干净）", "4、印刷车贴LOGO需在前左 右车门居中上位置，上下左右距离需一致"];
        break;
    case 9://贴二维码照片存储
        photo = [require("../image/prepareWork/show/code1.png"), require("../image/prepareWork/show/code2.png")];
        text = ["1、二维码需贴在左右后小窗内侧。", "2、二维码位置需居中，粘贴时需保持二维码平直贴正，底边需和后小窗对其平行。"];
        break;
    case 10://风挡标志照片存储
        photo = [require("../image/prepareWork/show/windshield1.png"), require("../image/prepareWork/show/windshield2.png")];
        text = ["1、贴放位置需在挡风玻璃右上角", "2、贴放标志需平整、摆正", "3、贴放顺序先贴保险标后贴年检标"];
        break;
    case 14://固体清新剂照片存储
        photo = [require("../image/prepareWork/show/solid1.png"), require("../image/prepareWork/show/solid2.png")];
        text = ["1、香薰需要撕开里面封装纸", "2、香薰统一摆放在主驾驶座椅底下。"];
        break;
    case 15://脚垫
        photo = [require("../image/prepareWork/show/mat1.png"), require("../image/prepareWork/show/mat2.png")];
        text = ["1、前后脚垫摆放需平整"];
        break;
}
var str1 = "",
    str2 = "";
for (var i = 0; i < photo.length; i++) {
    str1 += '<div class="photo-img"><img src="' + photo[i] + '" /><input class="image" type="hidden" value="' + photo[i] + '" /></div>';
}
$(".photoshow-content").html(str1);
for (var i = 0; i < text.length; i++) {
    str2 += '<p>' + text[i] + '</p>';
}
$(".word-show").html(str2);