(function (){

module.exports = {
  generateKeypair: function(){
    var algorithm  = {
    name: "RSAES-PKCS1-v1_5",
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

