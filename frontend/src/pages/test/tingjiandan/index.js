/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: carlist
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/24-上午11:43
 Description:
 Param:
 Return:
 *************************************************/

require('./index.less')
const branches = [...require('./cd').data,...require('./nj').data]
/*import {Branch} from "./test";

let branch = new Branch()
branch.log()
branch.log()*/

var cd = [
  {address: "四川省成都市龙泉驿区君悦中央一期", location: "104.273195,30.568192"},
  {address: "四川省成都市锦江区万达瑞华酒店", location: "104.069731,30.647281"},
  {address: "四川省成都市锦江区博瑞创意成都", location: "104.085021,30.587461"},
  {address: "四川省成都市成华区和美西市场", location: "104.152356,30.630009"},
  {address: "四川省成都市双流区缤纷广场", location: "104.053453,30.505753"},
  {address: "四川省成都市武侯区中央鹭洲", location: "104.037800,30.550047"},
  {address: "四川省成都市郫都区沿河商业街", location: "103.910000,30.802750"},    //成都置信逸都沿河商业街A区  { 30.80197,103.90964}
  {address: "四川省成都市武侯区千禧大酒店", location: "104.041311,30.651540"},
  {address: "四川省成都市金牛区中铁二局集团中心医院", location: "104.053967,30.687881"},
  {address: "四川省成都市双流区花天锦地美食广场", location: "104.004769,30.571322"},
  {address: "四川省成都市锦江区东恒国际大厦", location: "104.093878,30.644589"},  //成都市东恒国际大厦地面停车场{30.660716,104.071976}
  {address: "四川省成都市锦江区攀钢集团", location: "104.075660,30.656803"},   //成都攀钢集团医院  {30.648805,104.102734}
  {address: "四川省成都市双流区邻里中心", location: "103.971532,30.532874"},   //成都凤凰汇邻里中心 {30.679918,103.883675}
  {address: "四川省成都市成华区典典养车", location: "104.116850,30.722100"},
  {address: "四川省成都市武侯区龙湖金楠时光", location: "103.993341,30.649394"},
  {address: "四川省成都市", location: "104.066541,30.572269"},    //成都兴光华办公楼
  {address: "四川省成都市", location: "104.066541,30.572269"},    //成都南湖1号
  {address: "四川省成都市金牛区西大国际", location: "104.050946,30.677015"},
  {address: "四川省成都市青白江区公园世家", location: "104.278361,30.892566"},
  {address: "四川省成都市", location: "104.066541,30.572269"}, //德必川易报园
  {address: "四川省成都市青羊区敦煌国际酒店", location: "104.059352,30.676903"},
  {address: "四川省成都市武侯区普利大厦", location: "104.081195,30.635753"},
  {address: "四川省成都市金牛区大发", location: "104.066301,30.682758"},  // 大发百度城 {30.663024,104.080549}
  {address: "四川省成都市武侯区中铁瑞城新界五期", location: "104.015929,30.629671"},
  {address: "四川省成都市武侯区凯悦新城", location: "104.081991,30.636877"},
  {address: "四川省成都市青羊区双流区中医医院", location: "104.086540,30.668278"},
//成都精太科技研发楼
  {address: "四川省成都市武侯区优客联邦一期", location: "104.030878,30.633422"},
  {address: "四川省成都市新都区皇冠假日酒店", location: "104.144727,30.752615"},
  {address: "四川省成都市金牛区西区医院", location: "104.030389,30.683052"},  //成都泌尿外科医院  {30.64477,104.02152}
  {address: "四川省成都市温江区永辉超市", location: "103.854259,30.686468"},
  {address: "四川省成都市武侯区蓝色加勒比", location: "104.077323,30.623316"},	//成都市蓝色加勒比停车场 {30.623624,104.077534}
  {address: "四川省成都市武侯区龙湖金楠天街", location: "103.995461,30.649599"},
  {address: "四川省成都市武侯区远鸿方程式", location: "104.021060,30.648719"},
  {address: "四川省成都市郫都区晨明爱家居总部", location: "103.922421,30.792202"},
  {address: "四川省成都市青羊区家园路", location: "104.013161,30.660982"},
  {address: "四川省成都市武侯区锦城大厦", location: "104.064800,30.590050"},
  {address: "四川省成都市武侯区向阳大厦宾馆", location: "104.069512,30.620681"},
  {address: "四川省成都市金牛区西锦国际", location: "104.046730,30.682194"},
//成都黄龙溪古镇    {address: "四川省成都市双流区古镇", location: "103.971467,30.315279"}   //成都黄龙溪古镇（停车场）  {30.318877,103.96828}
  {address: "四川省成都市成华区东锦城a区", location: "104.155034,30.650230"},
  {address: "四川省成都市新都区花都大道", location: "104.060906,30.760640"},
  {address: "四川省成都市郫都区岚牌街", location: "103.973179,30.753657"},    //成都岚牌街停车场  {30.753204,103.974017}
  {address: "四川省成都市武侯区康特孵化园", location: "104.042700,30.626750"},
  {address: "四川省成都市锦江区时代广场停车场", location: "104.079838,30.656340"},
  {address: "四川省成都市金牛区成都医学院天回校区", location: "104.112351,30.749787"},
  {address: "四川省成都市武侯区铜锣湾广场", location: "104.063801,30.644974"},
  {address: "四川省成都市双流区润驰国际广场", location: "103.925109,30.582567"},
  {address: "四川省成都市青羊区润道茶社", location: "103.954212,30.672050"},
  {address: "四川省成都市武侯区顺和街", location: "104.000139,30.631997"},
  {address: "四川省成都市龙泉驿区音乐广场", location: "104.265192,30.559987"},
  {address: "四川省成都市锦江区锦江", location: "104.137705,30.603166"},  //成都锦江大观医院{"30.605165,104.134433"}
  {address: "四川省成都市武侯区布鲁明顿广场", location: "104.061238,30.585068"},
  {address: "四川省成都市青羊区西村大院停车场", location: "104.001966,30.671464"},
  {address: "四川省成都市", location: "104.066541,30.572269"},    //成都新博新美连锁南门店 {30.638495,104.055674}
  {address: "四川省成都市武侯区苏宁广场", location: "104.065570,30.601295"},
  {address: "四川省成都市", location: "104.066541,30.572269"},    //成都顺风	顺丰{30.558269,104.064515}
  {address: "四川省成都市金牛区成都国际商贸城", location: "104.080440,30.792488"},   //成都国际商贸城一二区
  {address: "四川省成都市金牛区蓝光金荷花", location: "104.077211,30.688939"},	//成都市金荷花停车场 {30.688072,104.077181}
  {address: "四川省成都市锦江区春熙商汇广场", location: "104.077654,30.657902"},
  {address: "四川省成都市武侯区银泰城", location: "104.059155,30.541111"},
  {address: "四川省成都市双流区创维成都物流产业园", location: "103.979268,30.524079"},
  {address: "四川省成都市", location: "104.066541,30.572269"},     //  成都富利  {30.586275,103.975216 }
  {address: "四川省成都市锦江区第一城停车场", location: "104.079649,30.655844"},
  {address: "四川省成都市成华区胜天雅筑", location: "104.157216,30.638179"},
  {address: "四川省成都市成华区胜天人居", location: "104.156285,30.638823"},
  {address: "四川省成都市龙泉驿区花海溢都酒店", location: "104.259806,30.561564"},
  {address: "四川省成都市锦江区锦都国际", location: "104.082830,30.658263"},
  {address: "四川省成都市武侯区汽配商城", location: "104.030139,30.635535"},
  {address: "四川省成都市郫都区沿河商业街", location: "103.910000,30.802750"},	//成都置信逸都沿河商业街B区 {30.803081,103.908759}
  {address: "四川省成都市金牛区上堰酒店", location: "104.017583,30.692845"},
  {address: "四川省成都市双流区创维西南培训中心", location: "103.975565,30.522790"},
  {address: "四川省成都市金牛区上层名人酒店", location: "104.079695,30.675854"},
  {address: "四川省成都市金牛区风情港", location: "104.055705,30.704717"},
  {address: "四川省成都市都江堰市成都学院", location: "103.578107,30.828650"},	// 学院路，，，
  {address: "四川省成都市武侯区寅生国际酒店", location: "103.978067,30.642300"},
  {address: "四川省成都市武侯区丽都国际中心", location: "104.062412,30.578284"},
  {address: "四川省成都市温江区", location: "103.837104,30.690460"},  // 成都温江区新博新美连锁店B区  {30.683475,103.866684}
  {address: "四川省成都市郫都区林涧上馆", location: "103.878527,30.812213"},  //成都林涧上馆广场 {30.812153,103.879213 	}
  {address: "四川省成都市金牛区红星美凯龙", location: "104.076555,30.721501"},  //成都市红星美凯龙佳灵店停车场  {30.630635,104.026638}
  {address: "四川省成都市锦江区时代|8号", location: "104.087484,30.647556"},	//成都市时代八号停车场{30.647238,104.087602}
  {address: "四川省成都市武侯区福年广场停车场", location: "104.064968,30.548116"},
  {address: "四川省成都市成华区誉美医院", location: "104.136042,30.680418"},
  {address: "四川省成都市青羊区综合商业楼", location: "103.963315,30.686555"},
  {address: "四川省成都市锦江区四川省人民医院友谊医院", location: "104.123076,30.623730"},
  {address: "四川省成都市锦江区总府皇冠假日酒店停车场", location: "104.077441,30.659432"},
  {address: "四川省成都市金牛区天悦城", location: "104.056084,30.724251"},
  {address: "四川省成都市金牛区茶店子客运站", location: "104.013060,30.704571"},
  {address: "四川省成都市成华区圣地亚家居", location: "104.096363,30.703857"},
  {address: "四川省成都市金牛区成都国际商贸城", location: "104.080440,30.792488"},
  {address: "四川省成都市温江区国色天乡一期", location: "103.828735,30.724064"},   //成都国色天乡一期童话世界地面{30.722234,103.828827}
  {address: "四川省成都市武侯区飞机设计研究所停车场", location: "104.052860,30.646130"},
  {address: "四川省成都市郫都区蜀都新天地美食广场", location: "103.903047,30.806678"},
  {address: "四川省成都市锦江区乐宾酒店", location: "104.114279,30.619384"},
  {address: "四川省成都市", location: "104.066541,30.572269"},    //成都红帆商务楼
  {address: "四川省成都市成华区维斯顿酒店", location: "104.166077,30.692651"},
  {address: "四川省成都市锦江区东恒国际", location: "104.094542,30.644539"},
  {address: "四川省成都市郫都区福梓路", location: "103.989528,30.747489"},
  {address: "四川省成都市新都区维也纳商业广场", location: "104.182433,30.809277"},
  {address: "四川省成都市金牛区希恩国际酒店", location: "104.019457,30.688382"},
  {address: "四川省成都市新都区新都假日酒店", location: "104.180677,30.809924"},
  {address: "四川省成都市锦江区阳光新业中心", location: "104.090404,30.643301"},
  {address: "四川省成都市双流区百港国际酒店", location: "103.973500,30.567389"},
  {address: "四川省成都市锦江区大业大厦", location: "104.069029,30.653874"},
]
var nj=[
  {address: "江苏省南京市江宁区金宝家具城停车场", location: "118.857367,31.950504"},
  {address: "江苏省南京市江宁区金宝市场", location: "118.606170,31.854582"},
  {address: "江苏省南京市鼓楼区", location: "118.769790,32.066336"},  //鼓楼区军队干休所
  {address: "江苏省南京市建邺区苏宁滨江壹号", location: "118.711340,32.003121"},
  {address: "江苏省南京市雨花台区雨花国际软件外包产业园", location: "118.780588,31.983009"},
  {address: "江苏省南京市秦淮区华盛园", location: "118.850064,32.018276"},
  {address: "江苏省南京市鼓楼区汉庭酒店", location: "118.765616,32.068778"},
  {address: "江苏省南京市建邺区拉德芳斯北苑", location: "118.730877,31.998579"},
  {address: "江苏省南京市玄武区山水大酒店", location: "118.806187,32.044546"},
  {address: "江苏省南京市秦淮区瑞华大厦", location: "118.783142,32.025379"},
  {address: "江苏省南京市雨花台区丰盛商汇", location: "118.761519,31.976317"},
  {address: "江苏省南京市", location: "118.796877,32.060255"},    //南京市中商万豪三乐地下停车场
  {address: "江苏省南京市江宁区证大喜玛拉雅中心", location: "118.804074,31.966367"},
  {address: "江苏省南京市鼓楼区长征医院南京分院", location: "118.749799,32.092880"},
  {address: "江苏省南京市鼓楼区南医大二附院东院", location: "118.756490,32.083152"},
  {address: "江苏省南京市江宁区金王府停车场", location: "118.824514,31.947278"},
  {address: "江苏省南京市浦口区鼎业开元大酒店", location: "118.631203,32.060591"},
  {address: "江苏省南京市鼓楼区龙吟广场", location: "118.769520,32.070389"},
  {address: "江苏省南京市秦淮区德兰大厦", location: "118.865559,32.020956"},
  {address: "江苏省南京市玄武区鹤东仙宾馆", location: "118.897702,32.092143"},
  {address: "江苏省南京市玄武区江苏新世纪大酒店", location: "118.800521,32.083593"},
  {address: "江苏省南京市六合区紫晶环球生活广场", location: "118.761328,32.231833"},
  {address: "江苏省南京市", location: "118.796877,32.060255"},    //南京市金灏枫广场
  {address: "江苏省南京市栖霞区花卉市场", location: "118.884272,32.105014"},
  {address: "江苏省南京市建邺区江苏保险综合大厦", location: "118.743024,32.026832"},
  {address: "江苏省南京市江宁区名店", location: "119.049637,32.057709"},
  {address: "江苏省南京市", location: "118.796877,32.060255"},    //南京平桥
  {address: "江苏省南京市浦口区动漫大厦", location: "118.696863,32.160092"},
  {address: "江苏省南京市鼓楼区典雅大厦", location: "118.738054,32.040096"},
  {address: "江苏省南京市秦淮区航天管理干部学院", location: "118.786388,32.020239"},
  {address: "江苏省南京市鼓楼区东南大学附属中大医院", location: "118.775597,32.073173"},
  {address: "江苏省南京市鼓楼区长征医院南京分院", location: "118.749799,32.092880"},
  {address: "江苏省南京市玄武区紫金东郡停车场", location: "118.893760,32.082507"},
  {address: "江苏省南京市玄武区苏粮国际大厦", location: "118.784602,32.055472"},
  {address: "江苏省南京市建邺区苏宁睿城", location: "118.730659,32.030575"},
  {address: "江苏省南京市鼓楼区星河广场", location: "118.773633,32.107402"},
  {address: "江苏省南京市鼓楼区美博城", location: "118.781016,32.092476"},
  {address: "江苏省南京市江宁区时代广场", location: "118.850605,31.953796"},
  {address: "江苏省南京市江宁区金宝窗帘布料城", location: "118.856724,31.949558"},
  {address: "江苏省南京市江宁区南方时代", location: "118.879111,31.998084"},
  {address: "江苏省南京市玄武区紫金联合立方", location: "118.808189,32.079458"},
  {address: "江苏省南京市鼓楼区众悦产业园", location: "118.775206,32.113252"},
  {address: "江苏省南京市", location: "118.796877,32.060255"},    //南京林化所
  {address: "江苏省南京市建邺区弘瑞广场", location: "118.747109,32.016784"},
  {address: "江苏省南京市秦淮区文创园", location: "118.836565,32.018152"},
  {address: "江苏省南京市雨花台区江苏科技金融大厦", location: "118.763876,31.984355"},
  {address: "江苏省南京市建邺区传媒粤海", location: "118.724716,32.004517"},
  {address: "江苏省南京市鼓楼区紫峰大厦", location: "118.783247,32.060244"},
  {address: "江苏省南京市江宁区天恒大厦", location: "118.806698,31.953123"},
  {address: "江苏省南京市鼓楼区金阜雅苑停车场", location: "118.765450,32.086960"},
  {address: "江苏省南京市玄武区国际会议大酒店", location: "118.843973,32.050091"},
  {address: "江苏省南京市六合区六合区人民医院", location: "118.845970,32.343765"},
  {address: "江苏省南京市江宁区苏尧广场停车场", location: "118.853862,31.953486"},
  {address: "江苏省南京市秦淮区江浦街道新城总部大厦新城总部大厦", location: "118.783250,32.041625"},
  {address: "江苏省南京市玄武区豪华精选酒店", location: "118.798729,32.042525"},
  {address: "江苏省南京市鼓楼区清凉门大街/湛江路", location: "118.743903,32.046389"},
  {address: "江苏省南京市玄武区紫金联合立方广场", location: "118.808189,32.079458"},
  {address: "江苏省南京市鼓楼区红桥市场", location: "118.773517,32.091879"},
  {address: "江苏省南京市栖霞区兴贤佳园", location: "118.841190,32.103030"},
//紫金联合立方广场
  {address: "江苏省南京市建邺区省辐射中住物业", location: "118.740481,31.991549"},
  {address: "江苏省南京市秦淮区苜蓿园大街", location: "118.832158,32.033696"},
  {address: "江苏省南京市鼓楼区凤凰台饭店", location: "118.780963,32.068348"},
  {address: "江苏省南京市江宁区金宝商业广场", location: "118.605783,31.856985"},
  {address: "江苏省南京市", location: "118.796877,32.060255"},//南京市苏宁钟山高尔夫别墅区停车场
  {address: "江苏省南京市玄武区南京明故宫店", location: "118.821327,32.042297"},
  {address: "江苏省南京市鼓楼区新华报业", location: "118.783050,32.044546"},
  {address: "江苏省南京市建邺区弘瑞广场", location: "118.747109,32.016784"},
//南京迈普洛商务酒店
  {address: "江苏省南京市秦淮区紫金名门", location: "118.829536,32.022633"},
  {address: "江苏省南京市鼓楼区河图文化广场停车场", location: "118.776724,32.090931"},
  {address: "江苏省南京市江宁区天印广场", location: "118.840002,31.951265"},
  {address: "江苏省南京市玄武区长江路|9号", location: "118.789792,32.043973"},
  {address: "江苏省南京市秦淮区金基月亮湾", location: "118.821132,32.024291"},
  {address: "江苏省南京市玄武区修贤苑", location: "118.835993,32.103200"},
  {address: "江苏省南京市秦淮区天丰大酒店", location: "118.786570,32.040342"},
  {address: "江苏省南京市秦淮区苏宁生活广场停车场", location: "118.786727,32.037026"},
  {address: "江苏省南京市玄武区南京市中西医结合医院", location: "118.857851,32.034296"},
  {address: "江苏省南京市雨花台区亚东观樾", location: "118.766355,32.007203"},
  {address: "江苏省南京市秦淮区江浦街道新城总部大厦新城总部大厦", location: "118.783250,32.041625"},
  {address: "江苏省南京市建邺区金融城", location: "118.718259,31.988640"},
  {address: "江苏省南京市秦淮区天安集团", location: "118.775670,32.026758"},
  {address: "江苏省南京市建邺区万达西地", location: "118.736076,32.028931"},
  {address: "江苏省南京市建邺区雨润集团", location: "118.728528,31.979324"},
  {address: "江苏省南京市江宁区润景科技广场", location: "118.869477,31.975707"},
  {address: "江苏省南京市建邺区台湾名品城", location: "118.716460,32.001246"},
//南京明嘉庭
  {address: "江苏省南京市江宁区日光广场", location: "118.853769,31.952588"},
  {address: "江苏省南京市鼓楼区苏红电子商务停车场", location: "118.763596,32.095003"},
  {address: "江苏省南京市鼓楼区和泰国际大厦", location: "118.769210,32.066301"},
  {address: "江苏省南京市建邺区丹枫园停车场", location: "118.726490,32.016910"},
  {address: "江苏省南京市建邺区乐基广场1期", location: "118.741240,32.024383"},
  {address: "江苏省南京市建邺区苏宁慧谷|E", location: "118.723605,32.032173"},
  {address: "江苏省南京市江宁区金碧装饰城", location: "118.849358,31.948196"},
  {address: "江苏省南京市玄武区南京海底世界", location: "118.844893,32.053101"},
  {address: "江苏省南京市建邺区联创科技大厦", location: "118.722672,32.034046"},
  {address: "江苏省南京市建邺区嘉业阳光城", location: "118.731302,31.995203"},
  {address: "江苏省南京市玄武区森林摩尔商业街区", location: "118.865687,32.038571"},
//南京市1912停车场{address: "江苏省南京市", location: "118.796877,32.060255"},
//南京市凤凰街交汇处停车场{address: "江苏省南京市鼓楼区停车场", location: "118.758634,32.040114"},
  {address: "江苏省南京市鼓楼区星月大厦", location: "118.772431,32.045417"},
  {address: "江苏省南京市鼓楼区凤凰西街", location: "118.758166,32.042870"},
  {address: "江苏省南京市鼓楼区老学堂创意园", location: "118.748591,32.087206"},
  {address: "江苏省南京市江宁区市民中心", location: "118.836302,31.940121"},
  {address: "江苏省南京市雨花台区雨花花卉园", location: "118.785814,31.998346"},
  {address: "江苏省南京市鼓楼区大地大厦", location: "118.778005,32.047085"},
  {address: "江苏省南京市浦口区莱福城", location: "118.711673,32.157103"},
  {address: "江苏省南京市玄武区紫金文化广场停车场", location: "118.836041,32.040379"},
  {address: "江苏省南京市江宁区世纪缘酒店", location: "118.818670,31.934048"},
  {address: "江苏省南京市浦口区苏宁环球天润广场", location: "118.724132,32.143789"},
  {address: "江苏省南京市秦淮区通济产业园", location: "118.798572,32.016902"},
  {address: "江苏省南京市玄武区十朝文化园", location: "118.842780,32.044475"},
  {address: "江苏省南京市鼓楼区清凉门大街/凤凰街", location: "118.756064,32.046106"},
  {address: "江苏省南京市浦口区江浦街道", location: "118.637957,32.060935"},
  {address: "江苏省南京市鼓楼区阅江广场", location: "118.743019,32.088446"},
  {address: "江苏省南京市秦淮区江苏饭店", location: "118.792459,32.032030"},
  {address: "江苏省南京市雨花台区紫荆广场", location: "118.793801,31.992301"},
  {address: "江苏省南京市鼓楼区老学堂创意园", location: "118.748145,32.086814"},
  {address: "江苏省南京市玄武区苏宁易购楼c区", location: "118.893143,32.089102"},
  {address: "江苏省南京市建邺区莫愁湖公园", location: "118.763210,32.031366"},
  {address: "江苏省南京市", location: "118.796877,32.060255"},//南京市白下科技园路面停车场
  {address: "江苏省南京市栖霞区紫园商业街", location: "118.887391,32.050008"},
  {address: "江苏省南京市浦口区泰徕城", location: "118.718499,32.154244"},
  {address: "江苏省南京市栖霞区近贤苑", location: "118.838946,32.104811"},
  {address: "江苏省南京市秦淮区凤台路", location: "118.768639,32.019406"},
  {address: "江苏省南京市浦口区金盛田广场", location: "118.639751,32.069347"},
  {address: "江苏省南京市浦口区软件大厦", location: "118.697057,32.161784"},
  {address: "江苏省南京市秦淮区银桥市场", location: "118.764926,32.013165"},
  {address: "江苏省南京市浦口区浦阳大厦", location: "118.715899,32.143637"},
  {address: "江苏省南京市鼓楼区龙江体育馆", location: "118.743366,32.056278"},
  {address: "江苏省南京市建邺区拉德芳斯南苑", location: "118.730877,31.998579"},
//南京合班商业街
  {address: "江苏省南京市玄武区紫苏园", location: "118.891867,32.092807"},
  {address: "江苏省南京市玄武区长江路|9号", location: "118.789792,32.043973"},
  {address: "江苏省南京市玄武区苏宁总部研发楼", location: "118.892593,32.088571"},
  {address: "江苏省南京市秦淮区1865创意园", location: "118.787900,32.008177"},
  {address: "江苏省南京市江宁区隆仁大厦", location: "118.806004,31.953049"},
  {address: "江苏省南京市建邺区江汊路", location: "118.741551,32.037489"},
  {address: "江苏省南京市玄武区黄埔大厦", location: "118.810280,32.042151"},
  {address: "江苏省南京市建邺区苏宁睿城", location: "118.730659,32.030575"},
  {address: "江苏省南京市秦淮区来燕商城", location: "118.788624,32.017553"},
  {address: "江苏省南京市雨花台区戴斯国际酒店", location: "118.771252,32.002719"},
  {address: "江苏省南京市玄武区中山陵索道", location: "118.863184,32.055872"},
  {address: "江苏省南京市江宁区福田电子商务产业园", location: "118.819241,31.924477"},
//南京市茂悦港商业地下停车场
  {address: "江苏省南京市玄武区理想家", location: "118.864574,32.095756"},
  {address: "江苏省南京市玄武区科技金融园", location: "118.819940,32.048017"},
  {address: "江苏省南京市江宁区南京湖滨金陵饭店", location: "118.817091,31.940028"},
  {address: "江苏省南京市鼓楼区金鹏大厦", location: "118.771947,32.043038"},
  {address: "江苏省南京市秦淮区江宴人家", location: "118.784047,32.023008"},
  {address: "江苏省南京市玄武区苏宁青创园", location: "118.891194,32.090187"},
  {address: "江苏省南京市建邺区弘瑞广场", location: "118.747109,32.016784"},
  {address: "江苏省南京市江宁区佳盛金陵酒店", location: "118.781578,31.955510"},
  {address: "江苏省南京市建邺区海峡城停车场", location: "118.684819,31.980219"},
  {address: "江苏省南京市秦淮区通济产业园", location: "118.798572,32.016902"},
  {address: "江苏省南京市", location: "118.796877,32.060255"},    //南京市顺诚停车场
  {address: "江苏省南京市玄武区诺富特酒店停车场", location: "118.891172,32.085485"},
  {address: "江苏省南京市鼓楼区浦江大厦", location: "118.735538,32.044517"},
  {address: "江苏省南京市玄武区未来城", location: "118.797849,32.047824"},
  {address: "江苏省南京市建邺区南湖电影院", location: "118.757332,32.031622"},
  {address: "江苏省南京市建邺区青奥北路", location: "118.705110,31.990007"},
  {address: "江苏省南京市江宁区时代广场", location: "118.850605,31.953796"},
  {address: "江苏省南京市玄武区科技金融园", location: "118.819940,32.048017"},
  {address: "江苏省南京市建邺区嘉业阳光城|1栋", location: "118.732386,31.995845"},
  {address: "江苏省南京市鼓楼区南医大二附院", location: "118.745235,32.080824"},
  {address: "江苏省南京市浦口区天悦城生活广场", location: "118.733314,32.151493"},
  {address: "江苏省南京市秦淮区瑞金路", location: "118.814818,32.031692"},
  {address: "江苏省南京市鼓楼区大方国际家居", location: "118.762791,32.094783"},
  {address: "江苏省南京市浦口区创智大厦", location: "118.696610,32.155717"},
  {address: "江苏省南京市玄武区江苏省会议中心", location: "118.812021,32.040850"},
  {address: "江苏省南京市", location: "118.796877,32.060255"},    //南京老浦口1914
  {address: "江苏省南京市浦口区老浦口", location: "118.741525,32.137194"},
  {address: "江苏省南京市玄武区南京邮电大学", location: "118.814249,32.070478"},
// 花园商业街
  {address: "江苏省南京市建邺区雨润集团总部", location: "118.727466,31.979827"},
]
const tingjiandan = [...cd,...nj]

let conf = {
  mapStyle: 'amap://styles/whitesmoke',
  zoom: 13,//级别
  center: [104.07074,30.650909 ]
}

let map = new AMap.Map("map", conf);
let branch_layer = null
let ting_layer = null

map.on('complete', function () {
  window.AMapUI.load(['ui/misc/PointSimplifier'], function (PointSimplifier) {

    branch_layer = new PointSimplifier({
      map: map, //所属的地图实例
      autoSetFitView: false,

      getPosition: function (item) {
        return [item.lng, item.lat];
      },
      getHoverTitle: function (item) {
        return item.name + (Number(item.biz_type) === 0 ? '_B' : '_B+');
      },
      renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
      renderOptions: {
        getGroupId: function (item) {
          return Number(item.biz_type)
        },
        groupStyleOptions: function (gid) {
          if (gid === 0) {
            return {
              // B类网点
              pointStyle: {
                width: 6,
                height: 6,
                fillStyle: '#292929'
              },
              pointHardcoreStyle: {
                width: 2,
                height: 2
              }
            }
          } else {
            return {
              // B+类网点
              pointStyle: {
                width: 6,
                height: 6,
                fillStyle: '#524bd7'
              },
              pointHardcoreStyle: {
                width: 2,
                height: 2
              }
            }
          }
        },
        //鼠标hover时的title信息
        hoverTitleStyle: {
          position: 'top'
        }
      }
    });
    branch_layer.setData(branches);

    ting_layer = new PointSimplifier({
      map: map, //所属的地图实例
      autoSetFitView: false,

      getPosition: function (item) {
        return item.location.split(',');
      },
      getHoverTitle: function (item) {
        return '对方_'+item.address
      },
      renderOptions: {
        pointStyle: {
          width: 6,
          height: 6,
          fillStyle: '#00ff20'
        },
        pointHardcoreStyle: {
          width: 2,
          height: 2
        },
        //鼠标hover时的title信息
        hoverTitleStyle: {
          position: 'top'
        }
      }
    });
    ting_layer.setData(tingjiandan);
  })
})

document.querySelector('#like').addEventListener('click',function(){
  if(branch_layer.isHidden()){
    branch_layer.show()
  }else{
    branch_layer.hide()
  }
})

document.querySelector('#ting').addEventListener('click',function(){
  if(ting_layer.isHidden()){
    ting_layer.show()
  }else{
    ting_layer.hide()
  }
})


