Interface
---

The interface will provide the following functions
- generateKeyPair: function() -> Promise({Uint8array,Uint8array})
- exportKey: function(WebCrypto::Key) -> Promise({Uint8array})
- importKey: function(String,Uint8array) -> Promise(WebCrypto::Key)
- signKey: function(WebCrypto::Key,String) -> Promise 
- verifyKey: function(WebCrypto::Key,String) -> Promise
- encrypt**: function(??) -> ?
- generateAsymmetricKey: function() -> ?

These will always work even if the underlying structure of the module might change. 


Get started
---

```javascript
    Crypto.generateKeyPair().then(
      function(key){
        var publicKey = key.publicKey
        var privatekey = key.privateKey
        //store private key in local store before import.

        Crypto.importKey("public",publicKey).then(
          function(pubkey){
            //do some encryption/decryption
          })
        Crypto.importKey("private",publicKey).then(
          function(privkey){
            //do some encryption/decryption 
          })
      });
```




Keys in Openssl
---

The following tests can be performed to ensure the key has been correctly generated;

Fist run ``Utils._uint8ArrayToString(arg)`` for both keys to get the keys in base64.

Now paste them into a new files to make it look somethig like this for the private.
```
-----BEGIN PRIVATE KEY-----
MIICeQIBADANBgkqhkiG9w0BAQEFAASCAmMwggJfAgEAAoGBAOpSXb05KoLox1yb
OB8AIYzia1qFoGzkflySq4lV/0OveQq30Y9wdNEIuWH1HnykSLbfsmybSwhL+Fla
6TfB8/zbKQJvM/muLGASs2685f9IGp+lWBODI3c35YuQqXvvirCw6Rzj5q6B7ny8
ZqYqM1mdiAHy/pi3Ya3Ifrd8TouxAgMBAAECgYEA1p/y9Gr0IUwNrykNUnfQQzbw
lc1nj9YKV8iQDg8S7HBBMiwEapnapcyT4MGf1xKy964Vw5zKMSNEqrO2gjfIvcVa
Ij7g5Et2OIdM7NaCTz/VduibI3Pfi5EquQf2tuckrEhpZqfgP622nzMxF8iLxEop
Vod/81K0nG/qlpuOgEECQQD4Ef/pn49HmEKj1VPK7zMgguOaW6n0SGB8f7X78a1P
8aPlUDtm7PY1kR5cBdKgfPHLNS3bOoym3dcCG5MMxSqlAkEA8c/cFY8UbF4oiCR0
a6W+e0M7J9LSrZDVqsXZL5hWsVuXBHJZY20bXezljxnMWWd4qte/OfmZc+qWUy1L
VmMrHQJBAOXHvnWHX69ggPHCq1ABSyllNDAJkh59YCpSHZ6WmQPA/yBstek7uz+Z
ATcaCaSwt0OUKbq0vA3g1MTWB9q/UyUCQQC7nDi2JVeEKJ2r2xTUfDjIa8YWxLQe
Y7PTFkPGcJw6aMRHd+ywfnNwMR9+Ilbwup3ddxxvf582VzigehDsim5lAkEAniRw
0dYsMoNiWQyfSKQpRwNej7HEeiGtfAdZZzIykXEoT2Fg4S0uoPuWNbdNmI7DTZwK
3Qwlmev+SV8dczsxMg==
-----END PRIVATE KEY----- 

```
and something like this for the public.
```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDqUl29OSqC6MdcmzgfACGM4mta
haBs5H5ckquJVf9Dr3kKt9GPcHTRCLlh9R58pEi237Jsm0sIS/hZWuk3wfP82ykC
bzP5rixgErNuvOX/SBqfpVgTgyN3N+WLkKl774qwsOkc4+auge58vGamKjNZnYgB
8v6Yt2GtyH63fE6LsQIDAQAB
-----END PUBLIC KEY-----

```
and name them example.pem and example.pub. 

To check that the key has a valid asn1 structure run
``$ openssl asn1parse -in example.pem``

To verify the components of the key run
``$ openssl rsa -in example.pem  -noout -text``

Encrypt 
``$ openssl rsautl -encrypt -inkey example.pub -pubin -in file.txt -out file.ssl``

Decrypt
``$ openssl rsautl -decrypt -inkey example.pem -in file.ssl -out decrypted.txt``







## What is the difference between Signing and Encrypting

When `encrypting`, you use their public key to write message and they use their private key to read it.

When `signing`, you use your private key to write message's signature, and they use your public key to check if it's really yours.
Simply when you want your Package to be publically readable, with no doubt that you sent it you use`singning`!

If you want your message to be recived only by a specific reciver, then you use `encrytion`!
[stackoverflow!](http://stackoverflow.com/questions/454048/what-is-the-difference-between-encrypting-and-signing-in-asymmetric-encryption)

## Prototype should be able to save Keys into secure store

This is what has w3c to say  about it.

---
This API, while allowing applications to generate, retrieve, and manipulate keying material, does not specifically address the provisioning of keys in particular types of key storage, such as secure elements or smart cards. This is due to such provisioning operations often being burdened with vendor-specific details that make defining a vendor-agnostic interface an unsuitably unbounded task. Additionally, this API does not deal with or address the discovery of cryptographic modules, as such concepts are dependent upon the underlying user agent and are not concepts that are portable between common operating systems, cryptographic libraries, and implementations. 
While the API in this specification provides a means to protect keys from future access by web applications, it makes no statements as to how the actual keying material will be stored by an implementation. As such, although a key may be inaccessible to web content, it should not be presumed that it is inaccessible to end-users. For example, a conforming user agent may choose to implement key storage by storing key material in plain text on device storage. Although the user agent prevents access to the raw keying material to web applications, any user with access to device storage may be able to recover the key.

---
[Reference](http://www.w3.org/TR/2013/WD-WebCryptoAPI-20130625/)
on their homepage the do provide some indexdb 

## Cross-browser compatibility

Since we all agreed upon that the crypto operations was to be preformed om the client side, there where not that many possible api candidates. `Polycrypt` is namely using a server to simulate the features specified in the webcrypto api,this makes it not so suttible for our purpose. The `Polycrypto` team has also contributed to a firefox none sever-dependent plugin named `Foxycrypt` it so happes to be that `Foxycrypt` is somthing close to a soley authorty. and it's not realy up to date:P
The obious choies is to use the the experimental web features implemented in `Chrome beta`,it's the only implemntation that is totaly in phase with the The web api development process,in other words up to date. 

## How do we solve the problem regarding exporting keys

WebCrypto keys are supposed to implement structured clone so in the future that would be the easiest way to serialize it to local storage.

## Notes
```
>>Crypto.generateKeyPair().then(function(keyp){ key1=keyp.publicKey;key2=keyp.privateKey})
Promise {then: function, catch: function}
>>Crypto.encryptResource(key1,"Hello world").then(function(aa){
res = aa;
})
>>Promise {then: function, catch: function}
>>Crypto.decryptResource(key2,res).then(function(hello){tt = hello})
Promise {then: function, catch: function}
>>Utils._arraybufferToString(new Uint8Array(tt))
"Hello world"
Crypto.encryptResource(key1,"Hello my friend").then(function(aa){
res = aa;
})
Promise {then: function, catch: function}
>>Crypto.decryptResource(key2,res).then(function(hello){tt = hello})
Promise {then: function, catch: function}
>>Utils._arraybufferToString(new Uint8Array(tt))
"Hello my friend"
```


