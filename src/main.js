$("body").mouseup(function (event) {
  var x = event.pageX;
  var y = event.pageY;
  $("body").simpletip();
  var tip = $("body").eq(0).simpletip();
  tip.hide();
  tip.setPos(x, y);
  tip.update("hello");
  tip.setPos(x, y);
  tip.show();
});
