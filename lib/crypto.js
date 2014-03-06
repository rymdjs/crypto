(function (){
  var root = this,
      Q = require('q'),
      utils = require("./cryptoback");

  var generationAlgorithm1 =  {
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: {
      name: "SHA-1"
    }
  },

  generationAlgorithm2 =  {
    name: "RSAES-PKCS1-v1_5",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01])
  },

  signAlgorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: {
      name: "SHA-1" //later we when supported wee will use SHA256
    }
  },

  verifyAlgorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: {
      name: "SHA-1",
    }
  },

  aesAlgorithmKeyGen = {
    name: "AES-CBC",
    // AesKeyGenParams
    length: 128
  },

  specFormats ={
    public: 'spki',
    private: 'pkcs8',
    secret: 'raw'
  },

  genAlgorithms = {
    public: "RSASSA-PKCS1-v1_5",
    private: "RSASSA-PKCS1-v1_5",
    secret: "AES-CBC"
  };



  var Crypto = {
    // Returns a publicKey and  a privateKey inside a Keypair.
    // i if you want to access the public key write :
    // .then(function(keypair){keypair.publicKey}) and the same for the private key
    generateKeyPair: function() {
      return utils._generateRSAKeypair(1024);
    },

    generateSymmetricKey: function(){
      return window.crypto.subtle.generateKey(aesAlgorithmKeyGen, true,
        ["encrypt", "decrypt", "unwrapKey"])
    },
    // will return the key as a Uint8Array
    // this can easily be parsed to string using base.stringify()
    // (SubjectPublicKeyinfo) -> Promise

    exportKey: function(generatedKey){
      return window.crypto.subtle.exportKey(specFormats[generatedKey.type],generatedKey).then(function(key){
        return new Uint8Array(key);

      });
    },

    // Takes a Uint8Array! and makes a key (type,SubjectPublicKeyinfo) -> Promise
    importKey: function(type, key){
      return window.crypto.subtle.importKey(specFormats[type],key,{name: genAlgorithms[type]}, true,
        ["encrypt", "decrypt"]);
    },

    signKey: function(generatedKey, data){
      return window.crypto.subtle.sign(signAlgorithm, generatedKey,utils._string2ArrayBuffer(data));
    },

    verifyKey: function(generatedKey, data){
      return window.crypto.subtle.verify(verifyAlgorithm, generatedKey, utils._string2ArrayBuffer(data), utils._string2ArrayBuffer(data));
    },

    //key: Key
    //data: Uint16Array
    encryptData: function(key, data){
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
      return this.encryptData(key, utils._string2ArrayBuffer(text));
    },

    //key: Key
    //data: Uint16Array
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
