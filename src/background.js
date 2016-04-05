(function () {
  var url = "http://open.iciba.com/huaci_new/dict.php?word=";
  var pattern = /dict\.innerHTML='([\s\S]*?)';/;
  chrome.extension.onConnect.addListener(function (port) {
    console.assert(port.name == "dict");
    port.onMessage.addListener(function (msg) {
      $.get(url + msg.word, function (data) {
        var result = (pattern.exec(data))[1];
        port.postMessage({time: msg.time, word: result});
      });
    });
  });
})();