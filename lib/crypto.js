(function (){

  var root = this;
    //Q = require('q');

  var Crypto = {
    generateKeypair: function(){

      function errorLogger(e) { //temporare
        throw "error  " + e;
    }
       rKeypair = {privateKey:null,publickey:null};
      var algorithm  = {
      name: "RSAES-PKCS1-v1_5", 
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01])
    };
      //["encrypt", "decrypt", "sign", 
      //"verify","deriveKey", "deriveBits",
      // "wrapKey","unwrapKey"])
    window.crypto.subtle.generateKey(algorithm, true, 
      ["encrypt", "decrypt", "sign", "verify","deriveKey", "unwrapKey"]).then(
        function (generatedKey) {

        console.log("generateKey: " + generatedKey);


        rKeypair.privateKey = generatedKey.privateKey;
        rKeypair.publicKey = generatedKey.publickey;
        //
        rKeypair.prototype.toArrayBuffer = window.crypto.subtle.exportKey('spki', generatedKey.publicKey).then(function (exportedKey) {
            return exportedKey.toString();
        }, errorLogger);
    })
    //return Q.fcall(function () {
    return rKeypair;
//})
   }
  };

  if(typeof module !== "undefined" && typeof exports !== "undefined") {
    module.exports = root.Crypto = Crypto;
  }
  else {
    root.Crypto = Crypto;
  }

})();


