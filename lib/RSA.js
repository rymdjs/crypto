{{(function (){
var rsa = require('bignumber-jt');

var keyPair = {privateKey:null,publicKey:null};
var rng  = window.crypto.getRandomValues(new Uint8Array(1))[0];
var ANS1_TAG_INTEGER = 2;
var ANS1_TAG_OCTETSTRING = 4;
var ANS1_TAG_SEQUENCE = 16;
var ANS1_TAG_STRUCTURE = "0x30";
var ANS1_TAG_DOUBLE_LENGTH = 130;
// var AlgorithmIdentifier ::= SEQUENCE {
//   algorithm:       OBJECT IDENTIFIER,
//   parameters:      ANY DEFINED BY algorithm OPTIONAL
// }

//  PublicKeyInfo = {
//   algorithm:       1,
//   PublicKey:       "BIT STRING"
// }

// PrivateKeyInfo = {
//   version:        1,
//   algorithm:       "RSAES-PKCS1-v1_5",
//   PrivateKey:      "BIT STRING"
// }
// RSAPrivateKey ::= SEQUENCE {
//     version           Version,
//     modulus           INTEGER,  -- n
//     publicExponent    INTEGER,  -- e
//     privateExponent   INTEGER,  -- d
//     prime1            INTEGER,  -- p
//     prime2            INTEGER,  -- q
//     exponent1         INTEGER,  -- d mod (p-1)
//     exponent2         INTEGER,  -- d mod (q-1)
//     coefficient       INTEGER,  -- (inverse of q) mod p
//     otherPrimeInfos   OtherPrimeInfos OPTIONAL
// }
//Public-Key Cryptography Standards (PKCS);



// var RSAPrivateKey =[
// SEQUENCE,
// version           Version,
// modulus           INTEGER, // -- n
// publicExponent    INTEGER, // -- e
// privateExponent   INTEGER, // -- d
// prime1            INTEGER, // -- p
// prime2            INTEGER, // -- q
// exponent1         INTEGER, // -- d mod (p-1)
// exponent2         INTEGER, // -- d mod (q-1)
// coefficient       INTEGER, // -- (inverse of q) mod p
// otherPrimeInfos   OtherPrimeInfos OPTIONAL
// ]
// }

longToByteArray = function(long) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = long & 0xff;
        byteArray [ index ] = byte;
        long = (long - byte) / 256 ;
    }

    return byteArray;
};



var encodingStruct = [
48,//0x30 — type tag indicating SEQUENCE
130,//0x82 - length in octets of value that follows //length of structure is spread over two byte
1,//0x01
34,//0x22 -> 290 bytes length 
48,//0x30 — type tag indicating SEQUENCE
13,//0xD - lenght 
6,//Non Primitive Data-type - Constructed
9,

];


// }

// var length = Uint8Array(4) ;
// var u8 = new Uint8Array(64);
// var u8 = new Uint8Array(64);
// var u8 = new Uint8Array(64);
// var u8 = new Uint8Array(64);


var BigInteger = require('bignumber-jt');
var RSA = {
//copied from stanford implentation
GenerateTwoPrimes: function(){
var key = new rsa.Key();
key.generate(2048, "10001");

console.log("Key:\n"+key.toString());
console.log(key.n.toString(16));

console.log("e:" + key.e);
//console.log("d:" + key.d.length);
console.log(key.e.toString(16));
console.log("\n");

var n = key.n.toString(16);
var e = key.e.toString(16);
var Ans1 = new Uint8Array(270); 
var position = 0;
Ans1[position++]= ANS1_TAG_STRUCTURE;
Ans1[position++]= ANS1_TAG_DOUBLE_LENGTH;
Ans1[position++]= "0x01";
Ans1[position++]= "0x0e";
Ans1[position++] = ANS1_TAG_INTEGER; //n -modulus
Ans1[position++] = ANS1_TAG_DOUBLE_LENGTH;
Ans1[position++] = "0x01";
Ans1[position++] = "0x00";
//8st

for(var i2 = 0;  i2 < (n.length);i2+=2){
Ans1[position++] = "0x"+ n.substring(i2,(i2+2));
}

Ans1[position++] = ANS1_TAG_INTEGER; //e -publicExponent
Ans1[position++] = "0x03";


for(var i2 = 0; i2 < e.length;i2+=2){
Ans1[position++] = "0x"+  e.substring(i2,(i2+2));
console.log(position+ " " + "0x"+ e.substring(i2,(i2+2)))
}
//Ans1[268] = key.e.toString(16);
//---e
return Ans1;
















}

}
module.exports = this.RSA = RSA;
})();}}