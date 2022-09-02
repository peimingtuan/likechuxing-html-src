/**
 * Created by garvey on 2017/9/4.
 */
export default {
  text: function (str) {
    return str.replace(/<[^>]>/g, '')
  }
}
