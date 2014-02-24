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


// Encrypt a text with public or private key (Key,String) -> Promise
encryptText: function(key,text,seed){

  console.log("here1");

  //The following functions should be refactored out to a separate utilities file

  // Converting arrayBuffer to and from string, as suggested by:
  // http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  function arraybufferToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }
  
  function stringToArraybufferView(str) {
    
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

  var cryptOperation;
  try {
    cryptOperation = window.crypto.subtle.encrypt(
        AlGORITHM,
        key,
        [stringToArraybufferView(text)]);
  } catch(exception) {
    console.log(exception);
  }

  return 
},


// Encrypt a blob with public or private key (Key,String) -> Promise
encryptBlob: function(key,blob,seed){
  
  var AlGORITHM = {
    name: "AES-CBC",
    // Use the supplied seed if present, otherwise randomize
    iv: seed ? seed : window.crypto.getRandomValues(new Uint8Array(16))
  };

  var uint8ArrayNew  = null;
  var arrayBufferNew = null;
  var fileReader     = new FileReader();

  fileReader.onload  = function(progressEvent) {

    arrayBufferNew = this.result;
    uint8ArrayNew  = new Uint8Array(arrayBufferNew);

    // warn if read values are not the same as the original values
    // arrayEqual from: http://stackoverflow.com/questions/3115982/how-to-check-javascript-array-equals
    function arrayEqual(a, b) { return !(a<b || b<a); };

    console.log('test');

    if (arrayBufferNew.byteLength !== arrayBuffer.byteLength) // should be 3
        console.warn("ArrayBuffer byteLength does not match");

    if (arrayEqual(uint8ArrayNew, uint8Array) !== true) // should be [1,2,3]
        console.warn("Uint8Array does not match");
  };

  return window.crypto.subtle.encrypt(
    AlGORITHM,
    key,
    [fileReader.readAsArrayBuffer(blob)]
  );
},


// Decrypt a text with public or private key  (Key,String) -> Promise
decryptText: function(key,text,seed){

  //The following functions should be refactored out to a separate utilities file

  // Converting arrayBuffer to and from string, as suggested by:
  // http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  function arraybufferToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }
  
  function stringToArraybufferView(str) {

    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);

    }
    return buf;
  }

  var AlGORITHM = {
    name: "AES-CBC",
    // Use the supplied seed if present, otherwise randomize
    iv: seed ? seed : window.crypto.getRandomValues(new Uint8Array(16))
  };
  
  return window.crypto.subtle.decrypt(
    AlGORITHM,
    Key,
    [stringToArraybufferView(text)]);
},


// Decrypt a blob with public or private key  (Key,String) -> Promise
decryptBlob: function(key,blob,seed){
  
  var AlGORITHM = {
    name: "AES-CBC",
    // Use the supplied seed if present, otherwise randomize
    iv: seed ? seed : window.crypto.getRandomValues(new Uint8Array(16))
  };

  var uint8ArrayNew  = null;
  var arrayBufferNew = null;
  var fileReader     = new FileReader();

  fileReader.onload  = function(progressEvent) {

    arrayBufferNew = this.result;
    uint8ArrayNew  = new Uint8Array(arrayBufferNew);

    // warn if read values are not the same as the original values
    // arrayEqual from: http://stackoverflow.com/questions/3115982/how-to-check-javascript-array-equals
    function arrayEqual(a, b) { return !(a<b || b<a); };

    console.log('test');

    if (arrayBufferNew.byteLength !== arrayBuffer.byteLength) // should be 3
        console.warn("ArrayBuffer byteLength does not match");

    if (arrayEqual(uint8ArrayNew, uint8Array) !== true) // should be [1,2,3]
        console.warn("Uint8Array does not match");
  };

  return window.crypto.subtle.decrypt(
    AlGORITHM,
    key,
    [fileReader.readAsArrayBuffer(blob)]
  );
},


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