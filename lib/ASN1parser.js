    (function (){

    //general Ansitags to bee used when parsing To RSAkeys
    var ANS1_TAG_SEQUENCE     = 48;
    var ANS1_TAG_OBJECT       = 6;
    var ANS1_TAG_INTEGER      = 2;
    var ANS1_TAG_NULL         = 5;
    var ANS1_TAG_OCTETSTRING  = 4;
    var ANS1_TAG_BIT_STRING   = 3;



    //And here is som black magic bu general in way


    // conversion between simplified Tags and ansi tags 
    // will only work for upp to 3 elements
    function lengthInBytes(len,id){
      var position = 0;
      var tag = 0;
      if ((id == 'SEQUENCE') 
        || (id == 'BIT STRING') 
        || (id == 'OCTET STRING')){
        position = 1;
        (len < 256) ? (tag = 129) : (tag = 130);
    }
      
      var str = len.toString(16);
      (str.length % 2) ? (str = '0' + str ) : {} ;
        
      var bitarray = new Uint16Array(position + str.length/2 + (str.length%2))
          
      while(str.length){
        bitarray[position++] = '0x' + str.substring(0,2);
        str = str.substring(2,str.length);
      }
    (bitarray[0]) ? {} : bitarray[0] = tag; 
    console.log(bitarray);
    return bitarray;
    }

    function copyData(data,array,i){
      for (var a = 0; a < data.length;a++ ){
        array[i+a] = data[i]; 
      }
    }

    function isTag(inp){
      return ((inp === 'SEQUENCE')
        || (inp === 'OBJECT')
        || (inp === 'INTEGER')
        || (inp === 'OCTET STRING')
        || (inp === 'BIT STRING')
        || (inp === 'SUBSEQUENCE')
        || (inp === 'NULL'));
    }

    function totalLength(struct){
      for(var i = 0;i < struct.length;i++){
        if(isTag(struct[i])){
          if(struct[i + 1] >  255){
            return struct[i + 1]+1+1+2;
          }else{
          return  struct[i + 1]+1+1+1;
        }
        }
      }
      
    }

    var ASN1parser =
    {
      parse: function(struct){

        var Ans1Array = new Uint8Array(totalLength(struct));
        var p = 0;
        for(var i = 0; i < struct.length; i++){
          var content = true;
          if (isTag(struct[i])){
          if (struct[i] === 'SEQUENCE'){
            Ans1Array[p++] = ANS1_TAG_SEQUENCE;
            content = 0;
          }
          else if (struct[i] === 'SUBSEQUENCE'){
            Ans1Array[p++] = ANS1_TAG_SEQUENCE;
            content = 0;
          }
          else if (struct[i] === 'OBJECT'){
            Ans1Array[p++] = ANS1_TAG_OBJECT;
          }
          else if (struct[i] === 'INTEGER'){
            Ans1Array[p++] = ANS1_TAG_INTEGER;
          }
          else if (struct[i] === 'NULL'){
            Ans1Array[p++] = ANS1_TAG_NULL;
            content = 0;
          }
          else if (struct[i] === 'OCTET STRING'){
            Ans1Array[p++] = ANS1_TAG_OCTETSTRING;
          }
          else if (struct[i] === 'BIT STRING'){
            Ans1Array[p++] = ANS1_TAG_BIT_STRING;
          }
          
          // if(struct[i+1].length){
          //   var head = struct[i+1];
          //     for(var c = 0; c < head.length; c++){ 
          //       Ans1Array[p++] = head[c];
          //     }
          // }
          var length = lengthInBytes(struct[i+1],struct[i])
          for(var c = 0; c < length.length; c++){ 
            Ans1Array[p++] = length[c];

          }
          if(content){
            var content = struct[i+2];
              for(var c = 0; c < content.length; c++){ 
                Ans1Array[p++] = content[c];
              }
          }
        }
        }
          return Ans1Array;
          }
          }



    module.exports = this.ASN1parser = ASN1parser;
    })();
