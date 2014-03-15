(function (){

  //dependecies
  var rsa = require('bignumber-jt');

  //general Ansitags to bee used when parsing To RSAkeys
  var ANS1_TAG_SEQUENCE     = 48;
  var ANS1_TAG_OBJECT       = 6;
  var ANS1_TAG_INTEGER      = 2;
  var ANS1_TAG_NULL         = 5;
  var ANS1_TAG_OCTETSTRING  = 4;
  var ANS1_TAG_BIT_STRING   = 3;


  var Utils = {
    _generateRSAKeypair: function(bitlength){
      if(!bitlength){
        throw new Error('invalid argument');
      };
      var key = new rsa.Key();
      key.generate(bitlength, '10001');
      var keyPair = {privateKey:null,publicKey:null};
      return Q.fcall(
        function(){
          keyPair.privateKey = Utils._encodeToPsck8(key.n,key.e,key.d,key.p,key.q,key.dmp1,key.dmq1,key.coeff)
          return keyPair;
        }).then(
        function(keypair){
          keyPair.publicKey = Utils._encodeToSpki(key.n,key.e);
          return keyPair
        });

    },


    //Converts Uint8Array to and from base64
    _uint8ArrayToString: function (a) {
      return btoa(String.fromCharCode.apply(0, a));
    },


    _base64ToUint8Array: function (s) {
      s = s.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
      return new Uint8Array(Array.prototype.map.call(atob(s), function (c) { return c.charCodeAt(0) }));
    },


    //Converts Strings to and from ArrayBufferview
    _arraybufferToString: function (buf) { // very instable
      return String.fromCharCode.apply(null, new Uint16Array(buf));
    },


    _stringToArrayBuffer: function (str) { // very instable
      var buf = new ArrayBuffer(str.length); // 2 bytes for each char
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }

      return bufView;
    },

    //Manually parses key components to Ansi1
    _encodeToPsck8: function(n,e,d,p,q,dmp1,dmq1,coeff){
      var n = n.toString(16);
      var e = e.toString(16);
      var d = d.toString(16);
      var p = p.toString(16);
      var q = q.toString(16);
      var dmp1 = dmp1.toString(16);
      var dmq1 = dmq1.toString(16);
      var coeff = coeff.toString(16);

      var Ans1 = new Uint8Array(637);
      var position = 0;

      //Head,Tag,length and Black magic
      Ans1[position++] = ANS1_TAG_SEQUENCE;
      Ans1[position++] = 130
      Ans1[position++] = 2
      Ans1[position++] = 121
      Ans1[position++] = ANS1_TAG_INTEGER
      Ans1[position++] = 1
      Ans1[position++] = 0
      Ans1[position++] = ANS1_TAG_SEQUENCE;
      Ans1[position++] = 13
      Ans1[position++] = ANS1_TAG_OBJECT;
      Ans1[position++] = 9
      Ans1[position++] = 42
      Ans1[position++] = 134
      Ans1[position++] = 72
      Ans1[position++] = 134
      Ans1[position++] = 247
      Ans1[position++] = 13
      Ans1[position++] = 1
      Ans1[position++] = 1
      Ans1[position++] = 1
      Ans1[position++] = ANS1_TAG_NULL;
      Ans1[position++] = 0
      Ans1[position++] = ANS1_TAG_OCTETSTRING;
      Ans1[position++] = 130
      Ans1[position++] = 2
      Ans1[position++] = 99
      Ans1[position++] = 48
      Ans1[position++] = 130
      Ans1[position++] = 2
      Ans1[position++] = 95
      Ans1[position++] = 2
      Ans1[position++] = 1
      Ans1[position++] = 0
      Ans1[position++] = 2
      Ans1[position++] = 129
      Ans1[position++] = 129
      Ans1[position++] = 0

      for(var i2 = 0;  i2 < (n.length);i2+=2){
        Ans1[position++] = '0x'+ n.substring(i2,(i2+2));
      }

      Ans1[position++] = ANS1_TAG_INTEGER; //r
      Ans1[position++] = 3; //y

      for(var i2 = 0; i2 < e.length;i2+=2){
        Ans1[position++] = '0x'+  ('0'+e).substring(i2,(i2+2));
      }
      Ans1[position++] = 2;
      Ans1[position++] = 129;
      Ans1[position++] = 129;
      Ans1[position++] = 0;

      for(var i2 = 0;  i2 < (d.length);i2+=2){ //173
        Ans1[position++] = '0x'+ d.substring(i2,(i2+2));
      }
      Ans1[position++] = 2;
      Ans1[position++] = 65;
      Ans1[position++] = 0;

      //304 - prime1:
      for(var i2 = 0;  i2 < (p.length);i2+=2){ //173
        Ans1[position++] = '0x'+ p.substring(i2,(i2+2));
      }

      Ans1[position++] = 2;
      Ans1[position++] = 65;
      Ans1[position++] = 0;

      //371 - prime2:
      for(var i2 = 0;  i2 < (q.length);i2+=2){ //173
        Ans1[position++] = '0x'+ q.substring(i2,(i2+2));
      }

      Ans1[position++] = 2;
      Ans1[position++] = 65;
      Ans1[position++] = 0;

      //438 - exponent1:
      for(var i2 = 0;  i2 < (dmp1.length);i2+=2){ //173
        Ans1[position++] = '0x'+ dmp1.substring(i2,(i2+2));
      }

      Ans1[position++] = 2;
      Ans1[position++] = 65;
      Ans1[position++] = 0;

      //505 - exponent2:
      for(var i2 = 0;  i2 < (dmq1.length);i2+=2){ //173
        Ans1[position++] = '0x'+ dmq1.substring(i2,(i2+2));
      }

      Ans1[position++] = 2;
      Ans1[position++] = 65;
      Ans1[position++] = 0;

      //572 - coefficient:
      for(var i2 = 0;  i2 < (coeff.length);i2+=2){ //173
        Ans1[position++] = '0x'+ coeff.substring(i2,(i2+2));
      }

      return Ans1;
    },


  _encodeToSpki: function(n,e){

    var n = n.toString(16);
    var e = e.toString(16);
    var Ans1 = new Uint8Array(162);
    var position = 0;
    //----
    Ans1[position++] = ANS1_TAG_SEQUENCE;
    Ans1[position++] = 129;
    Ans1[position++] = 159;//LENGTH;
    Ans1[position++] = ANS1_TAG_SEQUENCE;
    Ans1[position++] = 13;//TAG;
    Ans1[position++] = ANS1_TAG_OBJECT;
    Ans1[position++] = 9 // LENGTH
    Ans1[position++] = 42 //r
    Ans1[position++] = 134//s
    Ans1[position++] = 72//a
    Ans1[position++] = 134//E
    Ans1[position++] = 247//n
    Ans1[position++] = 13//c
    Ans1[position++] = 1//r
    Ans1[position++] = 1//y
    Ans1[position++] = 1//p
    Ans1[position++] = ANS1_TAG_NULL;
    Ans1[position++] = 0//LENGTH;
    Ans1[position++] = ANS1_TAG_BIT_STRING;
    Ans1[position++] = 129;
    Ans1[position++] = 141;
    Ans1[position++] = 0; // from here on Black Magick
    Ans1[position++] = 48;
    Ans1[position++] = 129;
    Ans1[position++] = 137;
    Ans1[position++] = 2;
    Ans1[position++] = 129;
    Ans1[position++] = 129;
    Ans1[position++] = 0;

    for(var i2 = 0;  i2 < (n.length);i2+=2){
      Ans1[position++] = '0x'+ n.substring(i2,(i2+2));
    }

    Ans1[position++] = ANS1_TAG_INTEGER; //r
    Ans1[position++] = 3; //y

    for(var i2 = 0; i2 < e.length;i2+=2){
      Ans1[position++] = '0x'+  ('0'+e).substring(i2,(i2+2));
    }

      return Ans1;
    }
  }

   module.exports = this.Utils = Utils;;
})();
