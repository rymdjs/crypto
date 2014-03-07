//var assert = require("assert")
var should = chai.should();


var public1 = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDbm/OeNgnAxBX8EpcC5u3u7dQTh4qiTeykFL3s4JtF4Uzj9dwqOujsQ5K5a5VGF/jtB1RSURd+sSJDpasTfgD3kRFxheJJj8SsInLYQPX+vehQozX6TFX2n844fdpjdfafYI30j0Cd+OXmS6Lk+2oVsfHl1j7Q519RlSgrzDZ9gwIDAQAB";
var private1 = "MIICeQIBADANBgkqhkiG9w0BAQEFAASCAmMwggJfAgEAAoGBANub8542CcDEFfwSlwLm7e7t1BOHiqJN7KQUvezgm0XhTOP13Co66OxDkrlrlUYX+O0HVFJRF36xIkOlqxN+APeREXGF4kmPxKwicthA9f696FCjNfpMVfafzjh92mN19p9gjfSPQJ345eZLouT7ahWx8eXWPtDnX1GVKCvMNn2DAgMBAAECgYEAxkRmDdB7va1Kq+mcrOIQrkXJ0lfssdvoabrQPawKg2yFHso5m2bUI3peXUjj3ASImHaliivsKlWBudE4QsDf3PasY3ePp1lpcs8CQMwRKjPMRQ0bKzmGVNrqUMtb37Fmdg7tdniwZtZC/OhZM3WpMGJoYGqPmBse+3mzL6evgQECQQDz9+fHuS7jEElcA9BLPjPlXDHY+kfzkoo6zlHGN3WqNHuX/Edh+gMbYUBhMd7iVcxAWvRaVAK23u+CzoOkb/6fAkEA5nCDFHj/FU12VGVFXwDMn9Kft/TXgEj38zHVCjz6wMs+0+gvti0hsJ3m8JOETZFIs4ZREsMOzP4AN4fcGPbqnQJBAH+iHEIioWLtLFPVMu2KV0AQ4YswNOA6s9JcCe/3J7mpx1cWBoo9b86tLC8tFfu3AypP6zIubVUagJcgT0KBzOUCQQBGUs+tz78IoTsbRkyFUZkgrQZQ/UdGvv3sGakKFtHvRBdIU/M7hUpiu81eXaZihZPKNZNIRn6d0GYAjFV+yNsJAkEAMNARsogydiYfMwZeSfQXFCXTgM9TdbHBucm6yDKmcMiftnpu7LaIfCCsFyqpfAs+5Ww2EztCjvbMb8Xpn2Hmdg==";
var secret1 = 'WszDvYl2h64sAo1I8sM+Jg==';
var exampledataStrings ={
  stdMessage:"Super secret message Hello world 2014!"
  ,b64short:"AAECAwQFBgcICQoLDA0ODxA="
  ,invalid:"123 ABCabc #!@#$%^&*()_"
};

var exampledataArrays ={

  stdMessage:
  new Uint8Array([83, 117, 112, 101, 114, 32, 115, 101, 99, 114, 101, 116,
    32, 109, 101, 115, 115, 97, 103, 101, 32, 72, 101, 108, 108, 111, 32,
    119, 111, 114, 108, 100, 32, 50, 48, 49, 52, 33])

  ,b64short:
  new Uint8Array([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])

  ,public1:
  new Uint8Array(Utils._base64ToUint8Array(public1))

  ,private1:
  new Uint8Array(Utils._base64ToUint8Array(private1))
  ,secret1:
  new Uint8Array(Utils._base64ToUint8Array(secret1))
};


var testArgs={
  _generateRSAKeypair: {keyLength:1024}
  , _uint8ArrayToString: {type:'one-one',from: exampledataArrays['b64short'], to: exampledataStrings['b64short'],returns:'String'}
  , _base64ToUint8Array: {type:'one-one',from: exampledataStrings['b64short'], to: exampledataArrays['b64short'],returns:'Object'}
  , _arraybufferToString: {type:'one-one',from: exampledataArrays['stdMessage'], to: exampledataStrings['stdMessage'],returns:'String'}
  , _stringToArrayBuffer: {type:'one-one',from: exampledataStrings['stdMessage'], to: exampledataArrays['stdMessage'],returns:'Object'}
  , _encodeToPsck8:null
  , _encodeToSpki:null
  , generateKeyPair:{keyLength:1024}
  , generateSymmetricKey:null
  , exportKey: {type:'many-one',returns:'Object'}
  , importKey: {type:'many-one',from:[exampledataArrays['public1'],exampledataArrays['private1'],exampledataArrays['secret1']],returns:'Object'}
  , signKey:null
  , verifyKey:null
  , encryptData:null
};





describe("General",function(){
  it("Chrome Version >  35.0.1800.0",function(){
    (window.navigator.appVersion.match(/Chrome\/(.*?) /)[1])
    .should.greaterThan("35.0.1800.0");
  });
});

describe("cryptoback.js",function(){
  describe("_generateRSAKeypair",function(){
    it("should throw a error if invalid arguments",function(){
      (function(){
        Utils._generateRSAKeypair();
      }).should.throw();
    });
    it("should return a promise",function(){
      return Utils._generateRSAKeypair(testArgs._generateRSAKeypair.keyLength).should.be.ok;

    });
    describe("publicKey",function(){
      it("should generate a publicKey such that a public Key exists",function(){
        return Utils._generateRSAKeypair(testArgs._generateRSAKeypair.keyLength).should.eventually.have.property('publicKey');
      });
      it("should generate a publicKey such that a public Key is a Uint8Array",function(){
        Utils._generateRSAKeypair(testArgs._generateRSAKeypair.keyLength).should.eventually.have.property('publicKey').with.should.be.a('Object');
      });

      it("should generate a publicKey such that a public have length 637",function(){
        return Utils._generateRSAKeypair(testArgs._generateRSAKeypair.keyLength).should.eventually.have.property('publicKey').with.lengthOf(162);
      });
    });

    describe("privateKey",function(){
      it("should generate a publicKey such that a private Key exists",function(){
        return Utils._generateRSAKeypair(testArgs._generateRSAKeypair.keyLength).should.eventually.have.property('privateKey');
      });
      it("should generate a publicKey such that a public is a Uint8Array",function(){
//not working apperently
return Utils._generateRSAKeypair(testArgs._generateRSAKeypair.keyLength).should.eventually.have.property('privateKey').with.should.be.a('Object');
});
      it("should generate a publicKey such that a public have length 162",function(){
        return Utils._generateRSAKeypair(testArgs._generateRSAKeypair.keyLength).should.eventually.have.property('privateKey').with.lengthOf(637);
      });

    });
  });

describe("_uint8ArrayToString",function(){
  it("should return a string",function(){
    Utils._uint8ArrayToString(testArgs._uint8ArrayToString.from).should.be.a(testArgs._uint8ArrayToString['returns']);
  }
  )
  it(("should given '"+testArgs._uint8ArrayToString.from +"' return "+testArgs._uint8ArrayToString.to),function(){
    Utils._uint8ArrayToString(testArgs._uint8ArrayToString.from).should.equal(testArgs._uint8ArrayToString.to);
  }
  )
});
describe("_base64ToUint8Array",function(){
  it("should return a Uint8Array",function(){
    Utils._base64ToUint8Array(testArgs._base64ToUint8Array.from).should.be.a(testArgs._base64ToUint8Array.returns);
  }
  )
  it(("should given '"+testArgs._base64ToUint8Array.from +"' return "+testArgs._base64ToUint8Array.to),function(){
    Utils._base64ToUint8Array(testArgs._base64ToUint8Array.from).should.eql(testArgs._base64ToUint8Array.to);
  }
  )
});
describe("_arraybufferToString",function(){
  it("should return a "+testArgs._arraybufferToString.returns,function(){
    Utils._arraybufferToString(testArgs._arraybufferToString.from).should.be.a(testArgs._arraybufferToString.returns);
  }
  )
  it(("should given '"+testArgs._arraybufferToString.from +"' return "+testArgs._arraybufferToString.to),function(){
    Utils._arraybufferToString(testArgs._arraybufferToString.from).should.eql(testArgs._arraybufferToString.to);
  }
  )
});
describe("_stringToArrayBuffer",function(){
  it("should return a "+testArgs._stringToArrayBuffer.returns,function(){
    Utils._stringToArrayBuffer(testArgs._stringToArrayBuffer.from).should.be.a(testArgs._stringToArrayBuffer.returns);
  }
  )
  it(("should given '"+testArgs._stringToArrayBuffer.from +"' return "+testArgs._stringToArrayBuffer.to),function(){
    Utils._stringToArrayBuffer(testArgs._stringToArrayBuffer.from).should.eql(testArgs._stringToArrayBuffer.to);
  }
  )
});
// describe("_encodeToPsck8",function(){
//   it("",function(){}
//     )
// });
// describe("_encodeToSpki",function(){
//   it("",function(){}
//     )
// });
});











describe("crypto.js",function(){
  describe("generateKeyPair",function(){
    it("should generate a publicKey such that a public Key exists",function(){
      return RymdCrypto.generateKeyPair(testArgs._generateRSAKeypair.keyLength).should.eventually.have.property('publicKey');
    });
    it("should generate a publicKey such that a public Key is a Uint8Array",function(){
      return RymdCrypto.generateKeyPair(testArgs.generateKeyPair.keyLength).should.eventually.have.property('publicKey').with.should.be.a('Object');
    });

    it("should generate a publicKey such that a public have length 637",function(){
      return RymdCrypto.generateKeyPair(testArgs.generateKeyPair.keyLength).should.eventually.have.property('publicKey').with.lengthOf(162);
    });

    it("should generate a publicKey such that a private Key exists",function(){
      return RymdCrypto.generateKeyPair(testArgs.generateKeyPair.keyLength).should.eventually.have.property('privateKey');
    });
    it("should generate a publicKey such that a public is a Uint8Array",function(){
      //not working apperently
    return RymdCrypto.generateKeyPair(testArgs.generateKeyPair.keyLength).should.eventually.have.property('privateKey').with.should.be.a('Object');
    });
    it("should generate a publicKey such that a public have length 162",function(){
      return RymdCrypto.generateKeyPair(testArgs.generateKeyPair.keyLength).should.eventually.have.property('privateKey').with.lengthOf(637);
    });

  });




 describe("generateSymmetricKey",function(){
   it("should have property algorithm",function(){
     return RymdCrypto.generateSymmetricKey().should.eventually.have.property('algorithm');
  });
   it("should have encrypt privileges",function(){
     return RymdCrypto.generateSymmetricKey().should.eventually.have.property('usages').contain('encrypt')//.with.containDeep(['encrypt']);
  });
    it("should have decrypt privileges",function(){
     return RymdCrypto.generateSymmetricKey().should.eventually.have.property('usages').contain('decrypt');
  });
     it("should have type secret",function(){
     return RymdCrypto.generateSymmetricKey().should.eventually.have.property('type').equal('secret');
  });

});
describe("importEncryptKey",function(){
  it("should given a Public Key import to a 'public' Key",function(){
    return RymdCrypto.importEncryptKey('public',testArgs.importKey.from[0]).should.eventually.eventually.have.property('type','public');
  })
  it("should given a Private Key import to a 'private' Key",function(){
    return RymdCrypto.importEncryptKey('private',testArgs.importKey.from[1]).should.eventually.eventually.have.property('type','private');
  })
  it("should given a Symmetric Key import to a 'secret' Key",function(){
    return RymdCrypto.importEncryptKey('secret',testArgs.importKey.from[2]).should.eventually.eventually.have.property('type','secret');
  })
});
describe("importSignKey",function(){
  it("should given a Public Key import to a 'public' Key",function(){
    return RymdCrypto.importSignKey('public',testArgs.importKey.from[0]).should.eventually.have.property('type','public');
  })
  it("should given a Private Key import to a 'private' Key",function(){
    return RymdCrypto.importSignKey('private',testArgs.importKey.from[1]).should.eventually.have.property('type','private');
  })
});

describe("exportKey",function(){
  
  it("should given a Public Key return a "+testArgs.exportKey.returns,function(){
    return RymdCrypto.importEncryptKey('public',testArgs.importKey.from[0]).then(function(key){
        return RymdCrypto.exportKey(key).should.eventually.be.eql(testArgs.importKey.from[0]);
    })
    
  });
  it("should given a Private Key return a "+testArgs.exportKey.returns,function(){
    (function(){
      return RymdCrypto.importEncryptKey('private',testArgs.importKey.from[1]).then(function(key){
        return RymdCrypto.exportKey(key);
    })
      }).should.throw()
  });
});







describe("signKey",function(){
  it("should sign with \'Signature\' and return a ArrayBuffer{}",function(){
  return RymdCrypto.generateKeyPair().then(function(key2){
    return RymdCrypto.importSignKey('private',key2.privateKey).then(function(key222){
      return RymdCrypto.signKey(key222,"IUOEWUTWEOITUUITWEIOWWIOE").should.eventually.be.a('ArrayBuffer');
    })
    })
  })
});
describe("verifyKey",function(){
  it("Browserversion up to date",function(){
    return RymdCrypto.generateKeyPair().then(function(key2){
    return RymdCrypto.importSignKey('private',key2.privateKey).then(function(key222){
      return RymdCrypto.signKey(key222,"IUOEWUTWEOITUUITWEIOWWIOE").then(function(data){
        return RymdCrypto.signKey(key222,data).should.eventually.be('Number');
      })
    })
    })
  })
});
describe("encryptData",function(){
  it("Browserversion up to date",function(){
    return RymdCrypto.generateKeyPair().then(function(key2){
    return RymdCrypto.importSignKey('private',key2.privateKey).then(function(key222){
      return RymdCrypto.signKey(key222,"IUOEWUTWEOITUUITWEIOWWIOE").should.eventually.be.a('ArrayBuffer');
    })
    })
  })
});
describe("exportKey",function(){
  it("Browserversion up to date",function(){
   return RymdCrypto.generateKeyPair().then(function(key2){
    return RymdCrypto.importSignKey('private',key2.privateKey).then(function(key222){
      return RymdCrypto.signKey(key222,"IUOEWUTWEOITUUITWEIOWWIOE").should.eventually.be.a('ArrayBuffer');
    })
    })
  })
});
});
 
