//var assert = require("assert")
var should = chai.should();
var public1 = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuXkhM6ZRBZiJKRakoh3fecYynMMfIqK5+bZtWUkav+GAWpgqJOFCvg/f5TRb9K7MPzHYYmHfYot+o0HVQgSsyssiDH6oouFawLdXaOPAfvmoeolLTHTLdMarb0f2hDML2ichCIJTQ2YsiYNS7cG03WgvLnV563WjMHPrUGZwrleC638YQNSw0A4bnQy81R5n2EJBAVtatuuUa8vaQv4qoO9qjYnF9LKKCla/i3QhFlMM+6GKZfmpfoZJ7eqbhZS7Itzz8Oi8rbUQzyFB/xSMg5f8D9imQVBJZq3sl34AvDMHrojnyQgIIqlAjr3LxKxnWm/yxCa4Z5ZdTkVYgAM4WwIDAQAB"
var bytes = new Uint8Array(1024);
describe("#SupportedBrowser: ",function(){
  it("Browserversion up to date",function(){
    (window.navigator.appVersion.match(/Chrome\/(.*?) /)[1])
    .should.equal("34.0.1848.0");

  })
});


// describe("Crypto", function() {

//   describe("generateKeypair", function() {

//     it("should ...", function() {
      
//     })

//   })
// })


describe("#Keygenerating: ",function(){
  it("Chrome: should generate publicKey: ",function(){
    window.Crypto.generateKeypair().then(
      function(keypair){
        keypair.publicKey.should.exist;
      })
  })
  it("Chrome: should generate privateKey: ",function(){
    window.Crypto.generateKeypair().then(
      function(keypair){
        keypair.privateKey.should.exist;
      })
  })
});
describe("#Keyimporting: ",function(){
  it("Chrome: should import from Uint8Array: ",function(){
    key = window.Crypto._base64ToUint8Array(public1);
    window.Crypto.importKey(key).then(function(key){
      key.should.exist;
      key.should.be.a("Uint8Array");
    }).should.exist;
  })
});
describe("#Keyexporting: ",function(){
  it("Chrome: should export privateKey to Uint8Array: ",function(){
    window.Crypto.generateKeypair().then(
      function(keypair){
        window.Crypto.exportKey(keypair.privateKey).then(
          window.Crypto.exportKey(key).then(function(key2){
            key2.should.exist;
            key2.should.be.a("Uint8Array");
          })
          )})
  })
  it("Chrome: should export publicKey to Uint8Array: ",function(){
    window.Crypto.generateKeypair().then(
      function(keypair){
        window.Crypto.exportKey(keypair.publicKey).then(
          window.Crypto.exportKey(key).then(function(key){
            key.should.exist;
            key.be.a("Uint8Array");
          })
          )})
  })
});
describe("#Keyconverting: ",function(){
  it("Chrome: should convert to Base64: ",function(){
    window.Crypto._uint8ArrayToString(bytes).should.be.a("String");
    //window.Crypto.Base64.parse(bytes).length.should.be.above(0);
  })     
  it("Chrome: should convert from Base64: ",function(){
    (window.Crypto._base64ToUint8Array
      (public1)).should.be.a("Uint8Array");
    })

    //promise.should.be.a("Uint8Array")   
  it("Chrome: should generate and export publicKey to Uint8Array: ",function(){
    window.Crypto.generateKeypair().then(
      function(keypair){
        window.Crypto.exportKey(keypair.publicKey).then(
          window.Crypto.exportKey(key).then(
            function(key){
            key.should.exist;
            key.be.a("Uint8Array");
          })
    )})
  })
    it("Chrome: should generate and export private to Uint8Array: ",function(){
    window.Crypto.generateKeypair().then(
      function(keypair){
        window.Crypto.exportKey(keypair.privateKey).then(
          window.Crypto.exportKey(key).then(
            function(key){
            key.should.exist;
            //key.be.a("Uint8Array");
          })
    )})
  })
});
describe("#Encryption: ",function(){

});



describe("#Decryption: ",function(){


});  
