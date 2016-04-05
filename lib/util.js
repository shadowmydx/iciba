if (!String.prototype.trim) {
    (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(rtrim, '');
        };
    })();
}
var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
var encodeHtml = function(s) {
      return (typeof s != "string") ? s :
          s.replace(this.REGX_HTML_ENCODE,
                    function($0){
                        var c = $0.charCodeAt(0), r = ["&#"];
                        c = (c == 0x20) ? 0xA0 : c;
                        r.push(c); r.push(";");
                        return r.join("");
                    });
  };
  var HTML_DECODE = {
        "&lt;"  : "<", 
        "&gt;"  : ">", 
        "&amp;" : "&", 
        "&nbsp;": " ", 
        "&quot;": "\"", 
        "&copy;": "©"
   };
   var REGX_HTML_DECODE = /&\w{1,};|&#\d{1,};/g;
   var decodeHtml = function(s){
      return (typeof s != "string") ? s :
          s.replace(this.REGX_HTML_DECODE,
                    function($0){
                        var c = undefined;
                        try {
                          c = this.HTML_ENCODE[$0]; // 尝试查表
                        } catch (err) {}
                        if(c === undefined){
                            // Maybe is Entity Number
                            var m = $0.match(/\d{1,}/);
                            if(m){
                                var cc = m[0];
                                cc = (cc === 0xA0) ? 0x20 : cc;
                                c = String.fromCharCode(cc);
                            }else{
                                // Not Entity Number
                                c = $0;
                            }
                        }
                        return c;
                    });
  };
   