var sendRequest = (function () {
  var port = chrome.extension.connect({name: "dict"});
  var mark = new Date();
  mark = mark.toString();
  return function (content) {
    port.postMessage({word: content, time: mark});
    console.assert(port.name == "dict");
    port.onMessage.addListener(function (msg) {
      if (msg.time == mark) {
        $("#wmydx img").remove();
        $("#wmydx").html(msg.word);
      }
    });
  };
})();
$("body").append('<div id="wmydx" class="mytooltip active" style="display: block; left: 887px; top: 638px;"></div>');
$("#wmydx").hide();
$("#wmydx").mouseup(function (event) {
  event.stopPropagation();
});
$("#wmydx").mousedown(function (event) {
  event.stopPropagation();
});
var x,y,preContent;
$("body").mousedown(function (event) {
  x = event.pageX;
});
$("body").mouseup(function (event) {
  x = x < event.pageX ? x : event.pageX;
  y = event.pageY;
  var content = window.getSelection().toString();
  content = content.trim();
  content = encodeHtml(content);
  if (content.length == 0 || content == preContent) {
    $("#wmydx").fadeOut();
    preContent = '';
    return;
  }
  preContent = content;
  $("#wmydx").css({
    "left": x + "px",
    "top": (y + 20) + "px"
  });
  $("#wmydx").fadeIn();
  $("#wmydx").html("<img height='80' width='200' src='" + chrome.extension.getURL('image/loading.gif') + "'/>");
  sendRequest(content);
});
