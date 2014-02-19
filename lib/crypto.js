(function (){

//Recomendend Algorithms
//RSASSA-PKCS1-v1_5 using SHA-1
//RSA-PSS using SHA-256 and MGF1 with SHA-256.
//RSA-OAEP using SHA-256 and MGF1 with SHA-256.

module.exports = {
  generateKeypair: function(){
    var algorithm  = {
    name: "RSAES-PKCS1-v1_5", // SHA-1 module 
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01])
  };

  var app = this;
  (crypto.subtle.generateKey( algorithm
    , true, ["verify","sign"]).then( 
    function(key) {
      
      var pubKey = key.publicKey;
      var privKey = key.privateKey;
         
    if (pubKey && privKey) {
      console.log("generateKey RSAES-PKCS1-v1_5: PASS");
      return { pubkey: app.pubKey , privkey: app.privKey};
    }
    else {
      console.error("generateKey RSAES-PKCS1-v1_5: FAIL");
    }
  }
  ))
}
});

