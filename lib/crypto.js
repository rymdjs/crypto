(function (){
  var root = this,
  Q = require('q'),
  cryptojs = require('crypto-js'),
  utils = require("./cryptoback");

  var generationAlgorithmSign =  {
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: {
      name: "SHA-256"
    }
  },

  generationAlgorithmEncrypt =  {
    name: "RSAES-PKCS1-v1_5",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01])
  },

  signAlgorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: {
      name: "SHA-256"
    }
  },

  verifyAlgorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: {
      name: "SHA-256",
    }
  },

  aesAlgorithmKeyGen = {
    name: "AES-CBC",
    length: 256
  },

  specFormats ={
    public: 'spki',
    private: 'pkcs8',
    secret: 'raw'
  }

  var Crypto = {
    // Expose util methods on Crypto object
    Utils: utils,

    generateKeyPair: function() {
      return utils._generateRSAKeypair(1024);
    },

    generateSymmetricKey: function(){
      return Q(window.crypto.subtle.generateKey(aesAlgorithmKeyGen, true, ["encrypt", "decrypt", "unwrapKey"]));
    },

    exportKey: function(generatedKey){
      return Q(window.crypto.subtle.exportKey(specFormats[generatedKey.type],generatedKey).then(function(key){
        return new Uint8Array(key);
      }));
    },

    importKey: function(type,purposes, key){
      switch(purposes) {
      case 'encrypt':
        return (type === 'secret')
          ? Q(window.crypto.subtle.importKey(specFormats[type], key, aesAlgorithmKeyGen, true, ["encrypt", "decrypt"]))
          : Q(window.crypto.subtle.importKey(specFormats[type], key, {name:"RSAES-PKCS1-v1_5"}, true, ["encrypt", "decrypt"]));
      case 'sign':
        return Q(window.crypto.subtle.importKey(specFormats[type],key,generationAlgorithmSign, true, ["sign", "verify"]));
      default:
        throw Error("invalid argument");
      }
    },

    signKey: function(generatedKey,data){
      return Q(window.crypto.subtle.sign(signAlgorithm, generatedKey,data));
    },

    verifyKey: function(generatedKey,sig,data){
      return Q(window.crypto.subtle.verify(verifyAlgorithm, generatedKey, sig, data));
    },

    hashData: function(data) {
      var deferred = Q.defer();
      deferred.resolve(cryptojs.SHA256(cryptojs.lib.WordArray.create(data)).toString());
      return deferred.promise;
    },

    hashBlob: function(blob) {
      var deferred = Q.defer();
      var reader = new FileReader();
      reader.onloadend = function() {
        var data = new Uint8Array(reader.result);
        deferred.resolve(this.hashData(data));
      }.bind(this);
      reader.readAsArrayBuffer(blob);
      return deferred.promise;
    },

    hashString: function(string) {
      var deferred = Q.defer();
      deferred.resolve(cryptojs.SHA256(string).toString());
      return deferred.promise;
    },

    encryptData: function(key,data){
      return Q(window.crypto.subtle.encrypt({name: key.algorithm.name, iv: new Uint8Array(16)}, key, data));
    },

    encryptBlob: function(key, blob) {
      var deferred = Q.defer();
      var reader = new FileReader();
      reader.onloadend = function() {
        var data = new Uint8Array(reader.result);
        deferred.resolve(this.encryptData(key, data));
      }.bind(this);
      reader.readAsArrayBuffer(blob);
      return deferred.promise;
    },

    decryptBlob: function(key, blob) {
      var deferred = Q.defer();
      var reader = new FileReader();
      reader.onloadend = function() {
        var data = new Uint8Array(reader.result);
        deferred.resolve(this.decryptData(key, data));
      }.bind(this);
      reader.readAsArrayBuffer(blob);
      return deferred.promise;
    },

    encryptText: function(key, text) {
      return this.encryptData(key, utils._stringToArrayBuffer(text));
    },

    decryptData: function(key, data){
      return Q(window.crypto.subtle.decrypt({
        name: key.algorithm.name,
        iv: new Uint8Array(16)
      },
      key, data));
    }
  };
  module.exports = root.RymdCrypto = Crypto;
})();
