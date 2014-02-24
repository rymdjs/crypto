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


