(function (){

  var root = this;
  if(typeof module !== "undefined") {
    var Q = require('q');
  }

//Converts Uint8Array to and from base64 
var Base64 = {
  toString: function (a) {
    return btoa(String.fromCharCode.apply(0, a));
  },
  parse: function (s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, '');
    return new Uint8Array(Array.prototype.map.call(atob(s), function (c) { return c.charCodeAt(0) }));
  }
};
//Convert subjectPublicKeyinfo to and from RsaPublic 


var Crypto = {  
// Returns a publicKey and  a privateKey inside a Keypair.
// i if you want to access the public key write :
// .then(function(keypair){keypair.publicKey}) and the same for the private key
generateKeypair: function(){ 
  var app = this;
  var FORMAT = 'spki';
  var ALGORITHM  = {
    name: "RSAES-PKCS1-v1_5", 
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01])
  };
  return window.crypto.subtle.generateKey(ALGORITHM, true, 
    ["encrypt", "decrypt", "unwrapKey"]);
},
// will return the key as a Uint8Array
// this can easily be parsed using base.stringify()
exportKey: function(generatedKey){
  var FORMAT = 'spki';
  if(generatedKey.type === 'private') {
    console.log("extracting a 'private' key is not a supported operation");
  }else{ 
    return window.crypto.subtle.exportKey(FORMAT, generatedKey).then(function(key){
      return new Uint8Array(key);
    });
  } 
},
// Takes a Uint8Array! and makes a key
importKey:function(key){ 
  var algorithm  = {
    name: "RSAES-PKCS1-v1_5", 
  };
  return window.crypto.subtle.importKey(FORMAT,key,ALGORITHM, true, 
    ["encrypt", "decrypt", "unwrapKey"]);
},
_subjectPublicKeyinfoToRsa: function (bytes){
//to be implemented like https://github.com/digitalbazaar/forge
},
_rsaToSubjectPublicKeyinfo: function (bytes){
//to be implemented like https://github.com/digitalbazaar/forge

}

};


if(typeof module !== "undefined" && typeof exports !== "undefined") {
  module.exports = root.Crypto = Crypto;

}
else {
  root.Crypto = Crypto;
  root.Base64 = Base64;
  root.Spki = Spki;
}
})();