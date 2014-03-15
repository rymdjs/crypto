(function (){
  var root = this,
  Q = require('q'),
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
    length: 128
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
      return window.crypto.subtle.generateKey(aesAlgorithmKeyGen, true,
        ["encrypt", "decrypt", "unwrapKey"])
    },

    exportKey: function(generatedKey){
      return window.crypto.subtle.exportKey(specFormats[generatedKey.type],generatedKey).then(function(key){
        return new Uint8Array(key);
      });
    },

    importEncryptKey: function(type,purposes, key){
      switch(purposes){

      case 'encrypt':
        if (type === 'secret'){
          return window.crypto.subtle.importKey(specFormats[type],key,aesAlgorithmKeyGen,true,
            ["encrypt", "decrypt"])
        };
        return window.crypto.subtle.importKey(specFormats[type],key,{name:"RSAES-PKCS1-v1_5"},true,
          ["encrypt", "decrypt"]);
      break;

      case 'sign':
        return window.crypto.subtle.importKey(specFormats[type],key,generationAlgorithmSign, true,
          ["sign", "verify"]);
        break;
      default:

      }
    },

    // importSignKey: function(type, key){
    // return window.crypto.subtle.importKey(specFormats[type],key,generationAlgorithmSign, true,
    //   ["sign", "verify"]);
    // },

    signKey: function(generatedKey,data){
      return window.crypto.subtle.sign(signAlgorithm, generatedKey,data);
    },

    verifyKey: function(generatedKey,sig,data){
      return window.crypto.subtle.verify(verifyAlgorithm, generatedKey, sig, data);
    },

    encryptData: function(key,data){
      return window.crypto.subtle.encrypt({name: key.algorithm.name, iv: new Uint8Array(16)},
        key, data);
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
      return window.crypto.subtle.decrypt({
        name: key.algorithm.name,
        iv: new Uint8Array(16)
      },
      key, data);
    }
  };
  module.exports = root.RymdCrypto = Crypto;
})();
