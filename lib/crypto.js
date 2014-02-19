(function (){

  var root = this;
    //Q = require('q');

  var Crypto = {
    generateKeypair: function(){
      var algorithm  = {
      name: "RSA-PSS", 
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01])
    };

    crypto.subtle.generateKey(algorithm, true, ["verify","sign"]).then(function(key) {
        
        var pubKey = key.publicKey;
        var privKey = key.privateKey;
           
      if (pubKey && privKey) {
        console.log("generateKey RSAES-PKCS1-v1_5: PASS");
          console.log(pubKey); 
          console.log(privKey);
      }
      else {
        console.error("generateKey RSAES-PKCS1-v1_5: FAIL");
      }
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

