(function (){

  //dependecies
  var rsa = require('bignumber-jt'),
      ASN1parser = require('./ASN1parser'),
      Q = require('q');


  //ASN1parser.isTag(3);

  //general Ansitags to bee used when parsing To RSAkeys
  var ANS1_TAG_SEQUENCE     = 48,
      ANS1_TAG_OBJECT       = 6,
      ANS1_TAG_INTEGER      = 2,
      ANS1_TAG_NULL         = 5,
      ANS1_TAG_OCTETSTRING  = 4,
      ANS1_TAG_BIT_STRING   = 3;
  
  var ANS1_STRING_RSAENCRYPTION = [42,134,72,134,247,13,1,1,1]; //Object :rsaEncryption

  var Utils = {
    _generateRSAKeypair: function(bitlength){
      if(!bitlength){
        throw new Error('invalid argument');
      };
      var key = new rsa.Key();
      key.generate(bitlength, '10001');

      var keyPair = {privateKey:null,publicKey:null};

      return Q.all(
        [Utils._encodeToPsck8(key.n,key.e,key.d,key.p,key.q,key.dmp1,key.dmq1,key.coeff,bitlength),
        Utils._encodeToSpki(key.n,key.e,bitlength)])
        .spread(function (key1, key2) {
            return {privateKey:key1 ,publicKey:key2};
        });
    },
    //Manually parses key components to Ansi1
_encodeToPsck8: function(n,e,d,p,q,dmp1,dmq1,coeff,bitlength){
    var n = n.toString(16),
          e = e.toString(16),
          d = d.toString(16),
          p = p.toString(16),
          q = q.toString(16),
          dmp1 = dmp1.toString(16),
          dmq1 = dmq1.toString(16),
          coeff = coeff.toString(16);

      //var RSAKey = new Uint8Array(637),
       var position = 0;
      
      var totlength = 0,
          meta = [],
          fill = [],
          keylength = 0,
          middle =[],
          totlength = 0;

    // This part is used to determine what template to use  
    
    if (bitlength === 2048){
      totlength = 1214; //(2*130)+11(black magic eleven )
      meta = [48,130,4,164,2,1,0,2,130,1,1,0]; 
      middle = [2,130,0]
      fill = [2,129,129,0];
      keylength = 1192;
    }else{
      totlength = 633;//130+11(black magic eleven)
      meta = [48,130,2,95,2,1,0,2,129,129,0];
      middle = [2,129,129,0]
      fill = [2,65,0];
      keylength = 611;//636,611 
    }

    return Q.fcall(function(){
      var RSAKey = new Uint8Array(keylength),
          position = 0;
      for(var i = 0;  i < (meta.length);i++){
        RSAKey[position++] = meta[i];
        }
      for(var i2 = 0;  i2 < (n.length);i2+=2){
        RSAKey[position++] = '0x'+ n.substring(i2,(i2+2));
      }
      RSAKey[position++] = ANS1_TAG_INTEGER; //r
      RSAKey[position++] = 3; //y

      for(var i2 = 0; i2 < e.length;i2+=2){
        RSAKey[position++] = '0x'+  ('0'+e).substring(i2,(i2+2));
      }
      for(var i = 0;  i < (middle.length);i++){
        RSAKey[position++] = middle[i];
        }

      for(var i2 = 0;  i2 < (d.length);i2+=2){ //173
        RSAKey[position++] = '0x'+ d.substring(i2,(i2+2));
      }
      //fill
      for(var i = 0;  i < (fill.length);i++){
        RSAKey[position++] = fill[i];
        }

      //304 - prime1:
      for(var i2 = 0;  i2 < (p.length);i2+=2){ //173
        RSAKey[position++] = '0x'+ p.substring(i2,(i2+2));
      }
      //fill
      for(var i = 0;  i < (fill.length);i++){
        RSAKey[position++] = fill[i];
        }
      //371 - prime2:
      for(var i2 = 0;  i2 < (q.length);i2+=2){ //173
        RSAKey[position++] = '0x'+ q.substring(i2,(i2+2));
      }
      //fill
      for(var i = 0;  i < (fill.length);i++){
        RSAKey[position++] = fill[i];
        }
      //438 - exponent1:
      for(var i2 = 0;  i2 < (dmp1.length);i2+=2){ //173
        RSAKey[position++] = '0x'+ dmp1.substring(i2,(i2+2));
      }

      //fill
      for(var i = 0;  i < (fill.length);i++){
        RSAKey[position++] = fill[i];
        }

      //505 - exponent2:
      for(var i2 = 0;  i2 < (dmq1.length);i2 += 2){ //173
        RSAKey[position++] = '0x'+ dmq1.substring(i2,(i2+2));
      }

      //fill
      for(var i = 0;  i < (fill.length);i++){
        RSAKey[position++] = fill[i];
        }

      //572 - coefficient:
      for(var i2 = 0;  i2 < (coeff.length);i2+=2){ //173
        RSAKey[position++] = '0x'+ coeff.substring(i2,(i2+2));
      }
      
        return RSAKey;
      })
  .then(function (asn1Key) {
    // TAG,PROP,LENGTH,CONTENT
    // later the length will be caculated and not static
    
    return [
     'SEQUENCE',totlength,
     'INTEGER',1,[0],      
     'SUBSEQUENCE',13,         
     'OBJECT',9,ANS1_STRING_RSAENCRYPTION,
     'NULL',0,              
     'OCTET STRING',asn1Key.length,asn1Key 
     ];
    })
  .then(function (struct){
    return ASN1parser.parse(struct);
  });
    },

  _encodeToSpki: function(n,e,bitlength){
    
    var n = n.toString(16),
        e = e.toString(16),
        totlength = 0,
        meta = [],
        keylength = 0;

    // This part is used to determine what template to use  
     if (bitlength === 2048){
      totlength = 290; //(2*130)+11(black magic eleven )
      keylength = 271;
      meta = [0,48,130, 1,10,2,130,1,1,0]; //272 //257
      
      }else{

      totlength = 159 ;//130+11(black magic eleven)
      keylength = 141;
      meta =[0,48,129, 137,2,129,129,0]; //2194 //
     }
    
    return Q.fcall(function(){
        var RSAKey = new Uint8Array(keylength),
        position = 0;
        for(var i = 0;  i < (meta.length);i++){
        RSAKey[position++] = meta[i];
        }
        for(var i2 = 0;  i2 < (n.length);i2+=2){
        RSAKey[position++] = '0x'+ n.substring(i2,(i2+2));
        }
        RSAKey[position++] = ANS1_TAG_INTEGER; //r
        RSAKey[position++] = 3; //y
        for(var i2 = 0; i2 < e.length;i2+=2){
        RSAKey[position++] = '0x'+  ('0'+e).substring(i2,(i2+2));
        }
        return RSAKey;
      })
  .then(function (asn1Key) {
    // TAG,PROP,LENGTH,CONTENT
    // later the length will be caculated and not static  
    return [
     'SEQUENCE',totlength,         
     'SUBSEQUENCE',13,          
     'OBJECT',9,ANS1_STRING_RSAENCRYPTION,        
     'NULL',0,              
     'BIT STRING',asn1Key.length,asn1Key
     ];
    })
  .then(function (struct){
    return ASN1parser.parse(struct);
  });
    }
  }

   module.exports = Utils;
})();
//private.pem
// 0:d=0  hl=4 l= 633 cons: SEQUENCE          1+1+2+633 = 637
//     4:d=1  hl=2 l=   1 prim: INTEGER           :00
//     7:d=1  hl=2 l=  13 cons: SEQUENCE          
//     9:d=2  hl=2 l=   9 prim: OBJECT            :rsaEncryption
//    20:d=2  hl=2 l=   0 prim: NULL              
//    22:d=1  hl=4 l= 611 prim: OCTET STRING      [HEX DUMP]:

//1+13+9+611 = 634 / 637

//ssh_private.pem
// 0:d=0  hl=4 l=1214 cons: SEQUENCE          1+1+2+1214 =1218
//     4:d=1  hl=2 l=   1 prim: INTEGER           :00
//     7:d=1  hl=2 l=  13 cons: SEQUENCE          
//     9:d=2  hl=2 l=   9 prim: OBJECT            :rsaEncryption
//    20:d=2  hl=2 l=   0 prim: NULL              
//    22:d=1  hl=4 l=1192 prim: OCTET STRING      [HEX DUMP]

//1+13+9+1192 = 1215 / 1218

//public.pub
// 0:d=0  hl=3 l= 159 cons: SEQUENCE        1+1+1+159 = 162 
//    3:d=1  hl=2 l=  13 cons: SEQUENCE          
//    5:d=2  hl=2 l=   9 prim: OBJECT            :rsaEncryption
//   16:d=2  hl=2 l=   0 prim: NULL              
//   18:d=1  hl=3 l= 141 prim: BIT STRING

//13 + 9 + 141 = 163 / 162

// ssh_public.pub
//     0:d=0  hl=4 l= 290 cons: SEQUENCE    1+1+2+290 = 294         
//     4:d=1  hl=2 l=  13 cons: SEQUENCE           
//     6:d=2  hl=2 l=   9 prim: OBJECT            :rsaEncryption
//    17:d=2  hl=2 l=   0 prim: NULL              
//    19:d=1  hl=4 l= 271 prim: BIT STRING 

//13+9+141 = 292 / 294













