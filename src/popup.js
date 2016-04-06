// $("#debug").click(function () {
var currentTabId;
var tipInfo = {"open": "当前页面已经激活取词", "closed": "当前页面已经取消取词功能"};
var buttonInfo = {"open": "取消激活", "closed": "激活"};
var status = "open";

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
  currentTabId = tabs[0].id;
  var infoPort = chrome.extension.connect({name: "popupInfo"});
  infoPort.postMessage({tabId: currentTabId});
  infoPort.onMessage.addListener(function (msg) {
    if (msg.tabId == currentTabId) {
      status = msg.action;
      $("#tabStatus").html(tipInfo[status]);
      $("#switchButton").html(buttonInfo[status]);
    }
  });
  $("#switchButton").click(function () {
    var newStatus = status == "open" ? "closed" : "open";
    var switchPort = chrome.extension.connect({name: "popupSwitch"});
    switchPort.postMessage({tabId: currentTabId, action: newStatus});
    status = newStatus;
    $("#tabStatus").html(tipInfo[status]);
    $("#switchButton").html(buttonInfo[status]);
  });
});


// var infoPort = chrome.extension.connect({name: "popupInfo"});
// infoPort.postMessage({tabId: currentTabId});
// infoPort.onMessage.addListener(function (msg) {
//   if (msg.tabId == currentTabId) {
//     status = msg.action;
//   }
// });


// $("#tabStatus").html(tipInfo[status]);
// $("#switchButton").html(buttonInfo[status]);

// });


