(function (){

  var root = this;
  var Q = require('q');

  var Crypto = {
// Returns a publicKey and  a privateKey inside a Keypair.
// i if you want to access the public key write :
// .then(function(keypair){keypair.publicKey}) and the same for the private key
generateKeypair: function(){ 
  var app = this;
  var algorithm  = {
    name: "RSAES-PKCS1-v1_5", 
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01])
  };
  return window.crypto.subtle.generateKey(algorithm, true, 
    ["encrypt", "decrypt", "unwrapKey"]);
},
// will return the key as a Uint8Array
// this can easily be parsed using base.stringify()
exportKey: function(generatedKey){
  if(generatedKey.type === 'private') {
    console.log("extracting a 'private' key is not a supported operation");
  }else{ 
    return window.crypto.subtle.exportKey('spki', generatedKey).then(function(key){
      return new Uint8Array(key);
    });
  } 
},
// Takes a Uint8Array! and makes a key
importKey:function(key){ 
  var algorithm  = {
    name: "RSAES-PKCS1-v1_5", 
  };
  return window.crypto.subtle.importKey('spki',key,algorithm, true, 
    ["encrypt", "decrypt", "unwrapKey"]);
}
};
if(typeof module !== "undefined" && typeof exports !== "undefined") {
  module.exports = root.Crypto = Crypto;
}
else {
  root.Crypto = Crypto;
}
})();