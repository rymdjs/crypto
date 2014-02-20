
# Background research Algorithms 
## generateKeypair

### first thought
What algorithm is to be used?
There are plenty of fish in the sea, or not reelly, not in our case. Since we are limited by the 
methods containes in the W3C's webcrypto api, along with the browser specific implementations available. I, have chosen to use the "AES-CBC", and I want to motivate this choice by first refering to the 
table ['Registered algorithms'](https://dvcs.w3.org/hg/webcrypto-api/raw-file/tip/spec/Overview.html#dfn-KeyUsage.) Interpreting this table along with the cromium develpment [spreedsheet](https://docs.google.com/spreadsheet/ccc?key=0Agiw0cuQZfVGdHNUNXBhZEFkazkyVy1uM1pISnlKRWc#gid=0), "AES-CBC" is the only algorithm where all these properties allready have been implentend.

- importKey-raw
- importKey-jwk
- exportKey-raw
- exportKey-jwk
- decrypt
- encrypt
- generateKey

Since 'AES-CBC' knows how to export to raw, and 'HMAC' knows how to import to raw; there might be a possibility that we could convert when we want to sign or verify.

### second thought
As it turns out we cannot generate a keypair using "AES-CBC" therefor wee have to go with RSAES-PKCS1-v1_5.



    
