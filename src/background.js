(function () {
  var url = "http://open.iciba.com/huaci_new/dict.php?word=";
  var pattern = /dict\.innerHTML='([\s\S]*?)';/;
  var tabContainer = {};
  var portContainer = {};
  var switchButton = function (id, action) {
    var switchPort = portContainer[id];
    console.log(switchPort);
    switchPort.postMessage({option: "isOpen", tabId: id});
    tabContainer[id] = action;
  };
  chrome.tabs.onUpdated.addListener(function (tabId) {
    tabContainer[tabId] = "open";
  });
  chrome.extension.onConnect.addListener(function (port) {
    if (port.name == "dict") {
      port.onMessage.addListener(function (msg) {
        var content = decodeHtml(msg.word);
        $.get(url + content, function (data) {
          var result = (pattern.exec(data))[1];
          port.postMessage({time: msg.time, word: result});
        });
      });
    } else if (port.name == "popupSwitch") {
      port.onMessage.addListener(function (msg) {
        switchButton(msg.tabId, msg.action);
      });
    } else if (port.name == "popupInfo") {
      port.onMessage.addListener(function (msg) {
        if (!(msg.tabId in tabContainer)) {
          tabContainer[msg.tabId] = "open";
        }
        port.postMessage({tabId: msg.tabId, action: tabContainer[msg.tabId]});
      });
    } else if (port.name == "checkTab") {
      port.onMessage.addListener(function (msg) {
        port.postMessage({tabId: port.sender.tab.id, time: msg.time});
      });
    } else { // dealwith switch port
      port.onMessage.addListener(function (msg) {
        portContainer[msg.key] = port;
      });
    }
  });
})();