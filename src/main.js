var x,y,preContent,isOpen,tabId;
isOpen = true;
var switchIsOpen = function () {
  isOpen = !isOpen;
};

var sendRequest = (function () {
  var port = chrome.extension.connect({name: "dict"});
  var mark = new Date();
  mark = mark.toString();
  return function (content) {
    port.postMessage({word: content, time: mark});
    if (port.name == "dict") {
      port.onMessage.addListener(function (msg) {
        if (msg.time == mark) {
          $("#wmydx img").remove();
          $("#wmydx").html(msg.word);
        }
      });
    }
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
$("body").mousedown(function (event) {
  x = event.pageX;
});
$("body").mouseup(function (event) {
  if (isOpen) {
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
  }
});

(function () {
  var port = chrome.extension.connect({name: "checkTab"});
  var mark = new Date();
  mark = mark.toString();
  port.onMessage.addListener(function (msg) {
    if (msg.time == mark) {
      tabId = msg.tabId;
      var switchPort = chrome.extension.connect({name: "switch" + tabId});
      switchPort.postMessage({key: tabId});
      switchPort.onMessage.addListener(function (msg) {
        switchIsOpen();
      });
    }
  });
  port.postMessage({time: mark});
})();
