

// 拆分的秘密个数
const defaultSharesNumber= 3
//随机生成的数的范围
const defaultXRange=10000
//恢复秘密所需的最少密钥片段个数
const defaultResolveSecretNumber =2

// Input: secret value
// output: the secret fragment array 
export function encryptMPC(secret){
   if(typeof secret != BigInt){
      secret=BigInt(secret)
   }   
   //生成多项式的函数
   let poly=generatePoly(secret,defaultResolveSecretNumber)
  // generate the poly
   return splitSecret(poly,defaultSharesNumber); 
}
//拆分秘密
function splitSecret(poly,sharesNumber){
    let shares=[]
    let UniqueCache=new Set();
    for (let i=0;i<sharesNumber;i++){
      var pointer ={y:BigInt(poly[0])};
      //随机生成合理的x值
      while(true){
        let result=true;
        let randomNumber=BigInt(randomEvenNotZero(defaultXRange));
          for(let z=0;z<shares.length;z++){
             let x1=shares[z].x;
               if (randomNumber==x1){
                 result=false
                 break
             }
             if (x1%(randomNumber-x1)!=0){
                 result=false
                 break
             }
             if(randomNumber%(x1-randomNumber)!=0){
                 result=false
                 break
             }
          }
          if(!UniqueCache.has(randomNumber)&&result){
          UniqueCache.add(randomNumber);
          pointer.x=randomNumber;
          break
        }
      }
       //calculate the pointer according the poly
       for (let j=1;j<poly.length;j++){
          let  coefficient =BigInt(poly[j]);
          let  index=BigInt(j);
          pointer.y=pointer.y+coefficient*pointer.x**index;
       }
       shares.push(pointer);
    }
    return shares;
  }
  // input : 密钥片段数组
export function decryptMPC(shares){
   return createTheSecretFragment(shares,0);
}
function createTheSecretFragment(shares,x){
  if (typeof x !=BigInt){
    x=BigInt(x);
  }
  let secret = BigInt(0);
  for(let i=0;i<shares.length;i++){
    let temp = BigInt(1)
    //拉格朗日插值法实现
    for(let j=0;j<shares.length;j++){
      if (i!=j){
        temp=temp*BigInt(x-shares[j].x)/BigInt(shares[i].x-shares[j].x);
      }
    }
    secret=secret+shares[i].y*temp
   }
   return secret
}
// return  the array 
// Input: 秘密,恢复秘密最少的密钥片段
// secret:常数值
// resolveSecretNumber
// 生成随机多项式函数
function generatePoly(secret,resolveSecretNumber){
  // [常数项,一次的时候对应的系数]
    let result = [];
    // constant value
    result.push(secret);
    for(let i=0;i<resolveSecretNumber-1;i++){
      result.push(BigInt(randomEvenNotZero(defaultXRange)));
    }
    return result
}
// maxLength 
//Input (0,maxLength)
//生成随机数的工具函数
function randomEvenNotZero(maxLength){ 
   while(true){
      let randomNumber=Math.floor(Math.random()*maxLength)
      if(randomNumber%2==0&&randomNumber!=0){
          return randomNumber;
      }
    }
}

//the input type is array, the value is object,including x and y
//return the js object {x:BitInt type,y:BigInt type}
export function RandomCreateSecret(otherSecretFragment){
  let result ={}
  let xSet=new Set();
  let secret = decryptMPC(otherSecretFragment)
  for(let i=0;i<otherSecretFragment.length;i++){
    xSet.add(otherSecretFragment[i].x);
  }
  while(true){
    let find =true; 
    let randomX=BigInt(randomEvenNotZero(defaultXRange));
     xSet.forEach((value)=>{
        if (value == randomX){
          find=false;
        }else{
        if (value%(randomX-value)!=0){
          find=false
      }
      if(randomX%(value-randomX)!=0){
          find=false
      } 
    }
     })

  if (find){
       result.x=BigInt(randomX);
       result.y=createTheSecretFragment(otherSecretFragment,result.x);
       if(decryptMPC([result,otherSecretFragment[0]])==secret){
       return result;
       }
  }
  }
}
