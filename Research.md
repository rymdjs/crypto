
# Background research Algorithms 
 =======
## generateKeypair
What algorithm is to be used?
There are plenty of fish in the sea, or not reelly, not in our case. Since we are limited by the 
methods containes in the W3C's webcrypto api, along with the browser specific implementations available. First, the establishmen of a basic understanding is not to underestimate.
Listed as in the W3C document hereby i present the candidates.

- RSASSA-PKCS1-v1_5
  - The "RSASSA-PKCS1-v1_5" algorithm identifier is used to perform signing and verification using the RSASSA-PKCS1-v1_5
  - Sign,Verify,Generate

- RSA-PSS
  - The "RSA-PSS" algorithm identifier is used to perform signing and verification using the RSASSA-PSS algorithm 
  - Sign,Verify,Generate

- RSA-OAEP
  - The "RSA-OAEP" algorithm identifier is used to perform encryption and decryption ordering to the RSAES-OAEP algorithm
  - Sign,Verify,Generate

- ECDH
  - This describes using Elliptic Curve Diffie-Hellman (ECDH) for key generation and key agreement

- Diffie-Hellman
  - This describes using Diffie-Hellman for key generation and key agreement

These algorithms have been picked as much for their presens in the api, as for their abillity to return a Keypair.  

18.1. Registered algorithms

| Algorithm name | encrypt | decrypt | sign | verify | digest | generateKey | deriveKey | deriveBits |  importKey | exportKey | wrapKey | unwrapKey |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | 
|RSAES-PKCS1-v1_5 | ✔| ✔|  |  |  | ✔|  |  | ✔| ✔| ✔| ✔|
|RSASSA-PKCS1-v1_5|  |  | ✔| ✔|  | ✔|  |  | ✔| ✔|  |  |
|RSA-PSS|  |  | ✔| ✔|  | ✔|  |  | ✔| ✔|   
|RSA-OAEP|  |✔ |✔ |  |  |  |✔ |  |  |✔ |✔ |✔ |✔ |
|ECDSA|  |  | ✔| ✔|  | ✔|  |  | ✔| ✔|  |  |  |  |
|ECDH |  |  |  |  |  | ✔| ✔| ✔| ✔| ✔|  |  |  |  |  
|AES-CTR| ✔| ✔|  |  |  | ✔|  |  | ✔| ✔| ✔| ✔|  |
|AES-CBC| ✔| ✔|  |  |  | ✔|  |  | ✔| ✔| ✔| ✔|  |
|AES-CMAC|      ✔ ✔   ✔     ✔ ✔   
|AES-GCM| ✔ ✔       ✔     ✔ ✔ ✔ ✔
|AES-CFB| ✔ ✔       ✔     ✔ ✔ ✔ ✔
|AES-KW|            ✔     ✔ ✔ ✔ ✔
|HMAC|      ✔ ✔   ✔     ✔ ✔   
|DH|            ✔ ✔ ✔ ✔ ✔   
|SHA-1|         ✔             
|SHA-224|         ✔             
|SHA-256|         ✔             
|SHA-384|         ✔             
|SHA-512|         ✔             
|CONCAT|              ✔ ✔       
|HKDF-CTR|              ✔ ✔       
|PBKDF2 |             ✔ ✔       
