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
  };

  specFormats ={
    spki:'spki',
    pkcs8:'pkcs8'
  };

  var Crypto = {

    // Returns a publicKey and  a privateKey inside a Keypair.
    // i if you want to access the public key write :
    // .then(function(keypair){keypair.publicKey}) and the same for the private key

    generateKeyPair: function(){
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
      return window.crypto.subtle.exportKey(specFormats.spki,generatedKey).then(function(key){
        return new Uint8Array(key);
      });
    },

    // Takes a Uint8Array! and makes a key (type,SubjectPublicKeyinfo) -> Promise
    importKey: function(type, key){
      if (type === "private"){type = specFormats.pkcs8}
        else if(type === "public"){type = specFormats.spki};
      return window.crypto.subtle.importKey(type,key,{name: "RSAES-PKCS1-v1_5"}, true,
        ["encrypt", "decrypt"]);
    },

    signKey: function(generatedKey, resource){
      return window.crypto.subtle.sign(signAlgorithm, generatedKey,utils._string2ArrayBuffer(resource));
    },


    verifyKey: function(generatedKey, resource){
      return window.crypto.subtle.verify(verifyAlgorithm, generatedKey, utils._string2ArrayBuffer(resource), utils._string2ArrayBuffer(resource));
    },

    encryptResource: function(key, resource){

      return window.crypto.subtle.encrypt({name: key.algorithm.name, iv: new Uint8Array(16)},
        key, Utils._string2ArrayBuffer(resource));
    },

    //dencrypts a recource with public or private key  (Key,String) -> Promise
    decryptResource: function(key,resource){

    return window.crypto.subtle.decrypt({
        name: key.algorithm.name,
        iv: new Uint8Array(16)
      },

      key, new Uint16Array(resource));
    }


  };

  module.exports = root.Crypto = Crypto;

})();
