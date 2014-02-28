(function (){
  var bigInt = require("big-integer");
var lowprimes = 
[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,
97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,
191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,
283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,
401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,
509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,
631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,
751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,
877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];

//copied from stanford implentation
function IsProbablePrime(t,a) {
  var i, x = a.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return millerRabin(t,x);
}
function bnpMillerRabin(t,a) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

function GenerateTwoPrimes(bitlength){ 
var  pair = {privateKey:null,publicKey:null};
  var random = window.crypto.getRandomValues(new Uint32Array(2))
  var a = bigInt(0).toString();
  var b = bigInt(1);
  var limit = (bitlength/32)
  //Primes
  do{
    while(a.length < bitlength){
    var a = (a + (window.crypto.getRandomValues(new Uint32Array(1))[0]).toString());
  }
  }while(!a.isEven() &&
    !IsProbablePrime(a)
    );

  return {a:a.toString() ,b:b.toString()};
}


module.exports = this. = Crypto;
})();