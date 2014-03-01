
(function (){
var root = this;
var Q = require('q');
//var prime = require('bignumber-jt');
var RSA = require("./RSA");
var CryptoJS = require('crypto-js');
//var cryptico = require("./cryptico"); 
// for promisses
//var hash = require("./hash"); 
// for generation of keys
//var crypto = require('crypto');

generationAlgorithm1 =  {
name: "RSASSA-PKCS1-v1_5", 
modulusLength: 2048,
publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
hash: {
name: "SHA-1"
}
};

generationAlgorithm2 =  {
name: "RSAES-PKCS1-v1_5", 
modulusLength: 2048,
publicExponent: new Uint8Array([0x01, 0x00, 0x01])

};
encrytpionAlgorithm = {
name: "RSAES-PKCS1-v1_5",
iv: window.crypto.getRandomValues(new Uint8Array(16))
};

decrytpionAlgorithm = {
name: "RSAES-PKCS1-v1_5",
iv: window.crypto.getRandomValues(new Uint8Array(16))
};

signAlgorithm = {
name: "RSASSA-PKCS1-v1_5",
hash: {
name: "SHA-1"
}
};

verifyAlgorithm = {
name: "RSASSA-PKCS1-v1_5",
hash: {
name: "SHA-1",
}
};

exportFormat= 'pkcs8';

var Crypto = {  
// Returns a publicKey and  a privateKey inside a Keypair.
// i if you want to access the public key write :
// .then(function(keypair){keypair.publicKey}) and the same for the private key

generateKeypair: function(){ 
return window.crypto.subtle.generateKey(generationAlgorithm2, true, 
["encrypt", "decrypt"]);
},

// will return the key as a Uint8Array
// this can easily be parsed to string using base.stringify()
// (SubjectPublicKeyinfo) -> Promise
exportKey: function(generatedKey){
  // add detect if asymmetric or symmetric algoritm
return window.crypto.subtle.exportKey(exportFormat,generatedKey).then(function(key){
return new Uint8Array(key);
}
);
},
// Takes a Uint8Array! and makes a key (SubjectPublicKeyinfo) -> Promise
importKey: function(key){ 
return window.crypto.subtle.importKey(exportFormat,key,{name: "RSAES-PKCS1-v1_5"}, true, 
["encrypt", "decrypt"]);
},

signKey: function(generatedKey,resource){
return window.crypto.subtle.sign(signAlgorithm, generatedKey,root.Crypto._string2ArrayBuffer(resource));
},

verifyKey: function(generatedKey,resource){
return window.crypto.subtle.verify(verifyAlgorithm, generatedKey, root.Crypto._string2ArrayBuffer(resource), root.Crypto._string2ArrayBuffer(resource));
},

encryptResource: function(key,resource){
return window.crypto.subtle.encrypt(encrytpionAlgorithm,key,root.Crypto._string2ArrayBuffer(resource));
},

//dencrypts a recource with public or private key  (Key,String) -> Promise
decryptResource: function(key,resource){
return window.crypto.subtle.encrypt(decrytpionAlgorithm,key,root.Crypto._string2ArrayBuffer(resource));
},

// Following Methods is to bee considered help methods
//Convert subjectPublicKeyinfo to and from RsaPublic 
_subjectPublicKeyinfoToRsa: function (bytes){
//to be implemented like https://github.com/digitalbazaar/forge
//thease will need allot of work@!
},
_rsaToSubjectPublicKeyinfo: function (bytes){
//to be implemented like https://github.com/digitalbazaar/forge
//thease will need allot of work@!
},
//Converts Uint8Array to and from base64 
_uint8ArrayToString: function (a) {
return btoa(String.fromCharCode.apply(0, a));
},
_base64ToUint8Array: function (s) {
s = s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, '');
return new Uint8Array(Array.prototype.map.call(atob(s), function (c) { return c.charCodeAt(0) }));
},
//Converts Strings to and from ArrayBufferview
_arraybufferToString: function (buf) {
return String.fromCharCode.apply(null, new Uint16Array(buf));
},
_string2ArrayBuffer: function (str) {
var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
var bufView = new Uint16Array(buf);
for (var i=0, strLen=str.length; i<strLen; i++) {
bufView[i] = str.charCodeAt(i);
}
return bufView;
},
//generate private rsa key //used because there is no 
_generateRSAKeypair: function (bitlength){ // change to return a promise
  return RSA.GenerateTwoPrimes(1024);
}

};
module.exports = this.Crypto = Crypto;
})();
