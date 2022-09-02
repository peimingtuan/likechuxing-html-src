/**
 * Created by Administrator on 2018/5/3.
 */
import authSingObj from './signature'
var urls = decodeURIComponent(window.location.href);
var newUrl;
if (urls.substr(0, urls.indexOf(location.hash))) {
    newUrl = urls.substr(0, urls.indexOf(location.hash));
} else {
    newUrl = urls;
}
var sign_name = authSingObj.getSign(newUrl);
var ddConfigs = {
    config: function () {
        //������Ȩ�ӿ�
        dd.config({
            agentId: sign_name.agentId, // ���΢Ӧ��ID
            corpId: sign_name.corpId,//�����ҵID
            timeStamp: sign_name.timeStamp, // �������ǩ����ʱ���
            nonceStr: sign_name.nonceStr, // �������ǩ���������
            signature: sign_name.signature, // ���ǩ��
            type: '0',   //ѡ�0��ʾ΢Ӧ�õ�jsapi��1��ʾ���񴰵�jsapi������Ĭ��Ϊ0���ò�����dingtalk.js��0.8.3�汾��ʼ֧��
            jsApiList: ['runtime.info', 'biz.contact.choose',
                'device.notification.confirm', 'device.notification.alert',
                'device.notification.prompt', 'biz.ding.post', 'biz.util.uploadImageFromCamera', 'biz.util.uploadImage',
                'biz.util.openLink', 'biz.user.get', 'device.geolocation.get'] // �����Ҫʹ�õ�jsapi�б�ע�⣺��Ҫ��dd
        });
    }
}
export default ddConfigs