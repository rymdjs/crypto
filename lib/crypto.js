(function (){

  var root = this;
  Q = require('q');

  var Crypto = {
    generateKeypair: function(){
      var algorithm  = {
        name: "RSAES-PKCS1-v1_5", 
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01])
      };
        return window.crypto.subtle.generateKey(algorithm, true, 
          ["encrypt", "decrypt", "unwrapKey"]);
      },
      extractKey: function(generatedKey){
        if(generatedKey.type === 'private') {
          console.log("extracting a 'private' key is not a supported operation");
        }else{ 
          return window.crypto.subtle.exportKey('spki', generatedKey);
        } 
      }
    };
    if(typeof module !== "undefined" && typeof exports !== "undefined") {
      module.exports = root.Crypto = Crypto;
    }
    else {
      root.Crypto = Crypto;
    }
  })();