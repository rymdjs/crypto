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
var Spki = {
  toRsa: function (bytes){
    var nextByte = 0;
    var CONSTRUCTED = 32;
    var SET_OF      = 17;
    var NUM         = 31;

    ///
    // parsePublicKey() throws IOException{
    //     ASN1InputStream         aIn = new ASN1InputStream(keyData.getBytes());

    //     return aIn.readObject();
    // }
    var tag  = bytes[nextByte];
            if (tag <= 0){
              {if (tag === 0)
                 console.log("unexpected end-of-contents marker");
                return null;
                //throw new IOException("unexpected end-of-contents marker");
              }
              console.log("less");
              return null;
            }
            nextByte++;
            if(bytes[nextByte] - 127){
              console.log("invalid high tag number found");
              return null 
            }
          //
    //     // calculate tag number
    //     //
    var tagNo = tag & NUM; // usnsecure if or not
    var isConstructed = (tag & CONSTRUCTED) != 0;
    console.log(tagNo);




    // public ASN1Primitive readObject()
    //     throws IOException
    // {
    //     int tag = read(); //Reads the next byte of data from this input stream.
    //     if (tag <= 0)
    //     {
    //         if (tag == 0)
    //         {
    //             throw new IOException("unexpected end-of-contents marker");
    //         }

    //         return null;
    //     }

    //     //
    //     // calculate tag number
    //     //
    //     int tagNo = readTagNumber(this, tag);

    //     boolean isConstructed = (tag & CONSTRUCTED) != 0;

    //     //
    //     // calculate length
    //     //
    //     int length = readLength();

    //     if (length < 0) // indefinite length method
    //     {
    //         if (!isConstructed)
    //         {
    //             throw new IOException("indefinite length primitive encoding encountered");
    //         }

    //         IndefiniteLengthInputStream indIn = new IndefiniteLengthInputStream(this, limit);
    //         ASN1StreamParser sp = new ASN1StreamParser(indIn, limit);

    //         if ((tag & APPLICATION) != 0)
    //         {
    //             return new BERApplicationSpecificParser(tagNo, sp).getLoadedObject();
    //         }

    //         if ((tag & TAGGED) != 0)
    //         {
    //             return new BERTaggedObjectParser(true, tagNo, sp).getLoadedObject();
    //         }

    //         // TODO There are other tags that may be constructed (e.g. BIT_STRING)
    //         switch (tagNo)
    //         {
    //             case OCTET_STRING:
    //                 return new BEROctetStringParser(sp).getLoadedObject();
    //             case SEQUENCE:
    //                 return new BERSequenceParser(sp).getLoadedObject();
    //             case SET:
    //                 return new BERSetParser(sp).getLoadedObject();
    //             case EXTERNAL:
    //                 return new DERExternalParser(sp).getLoadedObject();
    //             default:
    //                 throw new IOException("unknown BER object encountered");
    //         }
    //     }
    //     else
    //     {
    //         try
    //         {
    //             return buildObject(tag, tagNo, length);
    //         }
    //         catch (IllegalArgumentException e)
    //         {
    //             throw new ASN1Exception("corrupted stream detected", e);
    //         }
    //     }
    // }


  
  },
  fromRsa: function (a){
   return null;
  
  }
};

var Crypto = {




//  
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