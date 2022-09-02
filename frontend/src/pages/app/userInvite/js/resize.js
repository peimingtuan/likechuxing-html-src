/**
 * Created by Administrator on 2018/2/11.
 */
export default function() {
    var htmlBq = document.documentElement,
        htmlWidth = htmlBq.clientWidth;
    if (htmlWidth >= 640) {
        htmlBq.style.fontSize = '40px';
    } else if (htmlWidth < 640 && htmlWidth >= 320) {
        htmlBq.style.fontSize = htmlWidth / (640 / 40) + 'px';
    } else if (htmlWidth < 320) {
        htmlBq.style.fontSize = '20px';
    }
}
