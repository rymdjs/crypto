(function (){

  var root = this;
  if(typeof module !== "undefined") {
    var Q = require('q');
  }

//Converts Uint8Array to and from base64 

var Crypto = {  
 Base64: {
  toString: function (a) {
    return btoa(String.fromCharCode.apply(0, a));
  },
  parse: function (s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, '');
    return new Uint8Array(Array.prototype.map.call(atob(s), function (c) { return c.charCodeAt(0) }));
  }
},
 //Add some browser kind of browser thing to make it work with firefox

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
// this can easily be parsed to string using base.stringify()
// (SubjectPublicKeyinfo) -> Promise
exportKey: function(generatedKey){

  var FORMAT = 'spki';
  if(generatedKey.type === 'private') {
    console.log("extracting a 'private' key is not a supported operation");
  }else{ 
    return window.crypto.subtle.exportKey(FORMAT,generatedKey).then(function(key){
      return new Uint8Array(key);
    });
  } 
},
// Takes a Uint8Array! and makes a key (SubjectPublicKeyinfo) -> Promise
importKey:function(key){ 
  var FORMAT = 'spki';
  var ALGORITHM  = {
    name: "RSAES-PKCS1-v1_5", 
  };
  return window.crypto.subtle.importKey(FORMAT,key,ALGORITHM, true, 
    ["encrypt", "decrypt", "unwrapKey"]);
},
//Convert subjectPublicKeyinfo to and from RsaPublic 
_subjectPublicKeyinfoToRsa: function (bytes){
//to be implemented like https://github.com/digitalbazaar/forge
//thease will need allot of work@!
},
_rsaToSubjectPublicKeyinfo: function (bytes){
//to be implemented like https://github.com/digitalbazaar/forge
//thease will need allot of work@!
},


//encrypts a text with public or private key (Key,String) -> Promise
encryptText: function(key,text,seed){

  console.log("here1");

  // Converting arrayBuffer to and from string, as suggested by:
  // http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  function arraybufferToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }
  
  function stringToArraybuffer(str) {
    
    console.log("here3");

    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    
    for (var i=0, strLen=str.length; i<strLen; i++) {
      console.log("here4");
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  var AlGORITHM = {
    name: "AES-CBC",
    // Use the supplied seed if present, otherwise randomize
    iv: seed ? seed : window.crypto.getRandomValues(new Uint8Array(16))
  };
  
  console.log("here5");

  console.log(window.crypto.subtle.encrypt(
    AlGORITHM,
    key,
    [stringToArraybuffer(text)]))

  return window.crypto.subtle.encrypt(
    AlGORITHM,
    key,
    [stringToArraybuffer(text)]);
},

//dencrypts a recource with public or private key  (Key,String) -> Promise
decryptResource: function(key,resource){
  var AlGORITHM = {
  name: "AES-CBC",iv: window.crypto.getRandomValues(new Uint8Array(16))
};
return window.crypto.subtle.encrypt(
  AlGORITHM,
  key,
  [convertPlainTextToArrayBufferView(resource)]);
},
//spoky something;
storeKey: function(key){

}
}


if(typeof module !== "undefined" && typeof exports !== "undefined") {
  module.exports = root.Crypto = Crypto;


}
else {
  root.Crypto = Crypto;

}
})();