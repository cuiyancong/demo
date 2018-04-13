$(document).ready(function() {
  // 话题列表上滑出现的动画
  $(".topicBtn").on('click', function(e) {
      var that = $('.topicList')
      that.show()
      that.animate({
        top: "-1px"
      }, 400)
    })
    // 点击添加话题
  $(".topicList").find('.item').on('click', function() {
      if ($(".editArea").find(".topic").length < 3) { // 限制话题的添加数量
        var topic = $(this).find('.topic').text()
        $(".editArea").append('<span class="topic">' + topic +
          '</span>&nbsp;')
        set_focus() //光标始终定位到最后
      } else {
        $('.tips').fadeIn(200) //话题数量超出限制提示
        setTimeout(function() {
          $('.tips').fadeOut(200)
        }, 2000)
        return
      }
      $(".topicList").hide()
      $('.topicList').css({
        'top': $("body").height()
      })
    })
    // 关闭话题列表
  $('.close').on('click', function() {
      var that = $('.topicList')
      that.animate({
        top: $("body").height() > document.documentElement.clientHeight ?
          $("body").height() : document.documentElement.clientHeight
      }, 400)
      setTimeout(function() {
        that.hide()
      }, 400)
    })
    // 监听话题输入
  $(".editArea").on("keyup", function(e) {
      var str = $(".editArea").html()
      if (str.charAt(str.length - 1) == '#') { //监听用户输入#号事件
        if (countInstances(str, "#") % 2 == 0) { //判断#号数量来触发话题变色效果
          if (ReplaceTopic($(".editArea").html())) {
            var span = ReplaceTopic($(".editArea").html())
            $(this).html("")
            $(this).html(span)
            set_focus() //光标定位到最后
          }
        }
      }
      if (e.keyCode == 8) { //监听backspace事件
        if ($(this).html().length == 0 || $(this).html() == "<br>") { //这是用来判断编辑框中是否为空，触发placeholder
          $(this).empty()
        }
        // 判断光标前的内容时候为话题，如果是话题直接删除
        var str = $('#editArea').html()
        var patt = /<span class="topic">([^<]+)<\/span>/g;
        var arr = str.match(patt) ? str.match(patt) : []
        var char = arr ? arr.pop() : ''
        var lastIndex = str.lastIndexOf(char)
        if (char) {
          if (char.length + lastIndex == str.length) {
            var newContent = str.substr(0, lastIndex)
            $('#editArea').html(newContent)
            set_focus()
          }
        }
      }
    })
    // 表情
  $(".emoji_icon").on('click', function(e) { //点击表情时添加到编辑框中
      e.stopPropagation();
      var name = $(this).attr("data-name");
      var img = '<img src="images/emoji/' +
        name +
        '.png" class="text_emoji_icon">'
      $("#editArea").append(img)
    })
    // 唤起表情框
  var emojiShow = true
  $(".emoji").on("click", function(e) {
      e.stopPropagation();
      $(".emojiBox").show()
      var mySwiper = new Swiper('.swiper-container', {
          autoplay: false,
          pagination: {
            el: '.swiper-pagination',
          },
          height: window.innerWidth / 320 * 165,
          speed: 500
        })
        //点击其他地方隐藏表情框
      $('html').on('click', function(
        e) {
        $('.emojiBox').hide()
      })
      if (!emojiShow) {
        $('.emojiBox').hide()
      }
      emojiShow = !emojiShow

    })
    // 表情框中的后退按钮
  $(".backspace").on('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    // 判断是否为表情
    var str = $('#editArea').html()
    var patt = /<img[^>]*class="text_emoji_icon">/gi
    var arr = str.match(patt) ? str.match(patt) : []
    var char = arr ? arr.pop() : ''
    var lastIndex = str.lastIndexOf(char)
      // 判断是否为话题
    var patt1 = /<span class="topic">([^<]+)<\/span>&nbsp;/g;
    var arr1 = str.match(patt1) ? str.match(patt1) : []
    var char1 = arr1 ? arr1.pop() : ''
    console.log(char1)
    var lastIndex1 = str.lastIndexOf(char1)
    if (char) { //为表情则删除
      if (char.length + lastIndex == str.length) {
        var newContent = str.substr(0, lastIndex)
        $('#editArea').html(newContent)
      } else {
        var newContent = str.substr(0, str.length - 1)
        $('#editArea').html(newContent)
      }
    } else if (char1) { //为话题则整个删除
      if (char1.length + lastIndex1 == str.length) {
        var newContent = str.substr(0, lastIndex1)
        $('#editArea').html(newContent)
        set_focus()
      }
    } else { //为文本则删除一位
      var newContent = str.substr(0, str.length - 1)
      $('#editArea').html(newContent)
    }
  })
})

function countInstances(mainStr, subStr) { //判断字符串中每个字符出现的次数
  var count = 0;
  var offset = 0;
  do {
    offset = mainStr.indexOf(subStr, offset);
    if (offset != -1) {
      count++;
      offset += subStr.length;
    }
  } while (offset != -1)
  return count;
}

function ReplaceTopic(str) { //##之前话题替换
  var r, re; // 声明变量。
  var ss = str;
  var i = 0
  if (/\#([^\#|.]+)\#/g.test(ss)) {
    console.log(/<span class="topic">([^<]+)<\/span>&nbsp;/g.test(ss), "asss")
    if (/<span class="topic">([^<]+)<\/span>&nbsp;/g.test(ss)) {
      ss = ss.replace(/<span class="topic">([^<]+)<\/span>&nbsp;/g, function(
        word) {
        console.log(word, "----")
        return word.match(/\#([^\#|.]+)\#/g)
      })
    }
    r = ss.replace(/\#([^\#|.]+)\#/g, function(word) {
      console.log(word)
      return '<span class="topic">' + word + '</span>&nbsp;';
    });
    return (r); //返回替换后的字符串
  } else {
    return false
  }
}

function set_focus() { //光标始终定位在编辑框的最后
  el = document.getElementById('editArea');
  //el=el[0];  //jquery 对象转dom对象
  el.focus();
  if ($.support.msie) {
    var range = document.selection.createRange();
    this.last = range;
    range.moveToElementText(el);
    range.select();
    document.selection.empty(); //取消选中
  } else {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
