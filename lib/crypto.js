(function (){

  var root = this;
    //Q = require('q');

  var Crypto = {
    generateKeypair: function(){
       function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
      }
      function errorLogger(e) {
        console.log("ERROR :: " + e);
    }

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
        window.crypto.subtle.exportKey('spki', generatedKey.publicKey).then(function (exportedKey) {
            console.log("exportKey: " + exportedKey.toString());
        }, errorLogger);


      //}
      // else {
      //   console.error("generateKey"+ algorithm.name +" FAIL");
      // }
    })
   }
  };

  if(typeof module !== "undefined" && typeof exports !== "undefined") {
    module.exports = root.Crypto = Crypto;
  }
  else {
    root.Crypto = Crypto;
  }

})();






  // function errorLogger(e) {
  //       console.log("ERROR :: " + e);
  //   }

  //   var algorithmKeyGen = {
  //       name: "RSASSA-PKCS1-v1_5",
  //       modulusLength: 2048,
  //       publicExponent: new Uint8Array([0x01, 0x00, 0x01])
  //   };

  //   window.crypto.subtle.generateKey(algorithmKeyGen, true, ["sign"]).then(function (generatedKey) {
  //       console.log("generateKey: " + generatedKey);
  //       window.crypto.subtle.exportKey('raw', generatedKey.publicKey).then(function (exportedKey) {
  //           console.log("exportKey: " + exportedKey);
  //       }, errorLogger);
  //       window.crypto.subtle.exportKey('raw', generatedKey).then(function (exportedKey) {
  //           console.log("exportKey: " + exportedKey);
  //       }, errorLogger);
  //   }, errorLogger);

