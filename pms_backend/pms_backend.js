const fs=require("fs");
const http= require("http");
const url= require("url");

const PORT = 8001;


http.createServer((req,res)=>{

    // cors rule
    res.writeHead(200,{
        "Access-Control-Allow-Origin":"*",
        'Access-Control-Allow-Methods':"PUT,DELETE",
        'Access-Control-Allow-Headers':"*"
    });
    

    let curUrl=url.parse(req.url,true)
    let fileDta=JSON.parse(fs.readFileSync("./crud.json"));
    let reqId=curUrl.query.id;
    
     if(req.method==='GET' && curUrl.pathname==="/products"){ //get specific array obj
        if(checkNull(reqId)){
            let product=fileDta.find(ele=> Number(ele.id)=== Number(reqId) )
            res.write(JSON.stringify(product));
            res.end();
        }else{
            res.write(JSON.stringify(fileDta));
            res.end();
        }
    }
    else if(req.method==="DELETE" && curUrl.pathname==='/products' ){ //update the array obj
            if(checkNull(reqId)){
                let indxProduct=fileDta.findIndex(ele=>Number(ele.id)===Number(reqId));
                console.log(indxProduct);
                fileDta.splice(indxProduct,1)
                let updatedProduct=JSON.stringify(fileDta);
                fs.writeFileSync("./crud.json",updatedProduct,err=> console.log("eror ocured"));
                res.end(JSON.stringify({message:"Delete sucessfully"}));
            }else{
                res.end(JSON.stringify({message:"ID required"}));
            }
    }
    
    else if(req.method==="PUT" && curUrl.pathname==='/products' ){ //update the array obj
        let el="";
        req.on("data",(chunk)=>{
            el+=chunk;
        })
        if(checkNull(reqId)){
            req.on("end",()=>{
                let reqUpdateData=JSON.parse(el);
                let indProduct=fileDta.findIndex(ele=>Number(ele.id)===Number(reqId));
                fileDta[indProduct].name=reqUpdateData.name;
                fileDta[indProduct].price=reqUpdateData.price;
                fileDta[indProduct].quantity=reqUpdateData.quantity;
                let updatedProduct=JSON.stringify(fileDta);
                console.log(updatedProduct);
                fs.writeFileSync("./crud.json",updatedProduct,err=> console.log("eror ocured"));
                
            });
            
            res.write(JSON.stringify({message:"Sucessfully Updated"}));
            res.end();
        }else{
            res.end(JSON.stringify({message:"ID required"}));
        }
    }
    else if(req.method==="POST" && curUrl.pathname==="/products"){ //add array obj
        let data="";
        req.on("data",chunk=>{
            data+=chunk;
        });
        if(checkNull(data)){
            req.on("end",()=>{
                let postData=JSON.parse(data);
                fileDta.push(postData);
                fs.writeFileSync("./crud.json",JSON.stringify(fileDta));
                
                res.write(JSON.stringify({message:"Sucessfully added"}));
                res.end();
            })
        }else{
            res.end(JSON.stringify({message:"Please enter all the fields"}));
        }
    }
    else if(req.method="OPTION"){
        res.end();
    }
}).listen(PORT,()=>{
    console.log(`server start on port no ${PORT}`);
})

// for check the null value
// if not null then true and vice versa
function checkNull(reqId){
    if(reqId !== null && reqId !== '' && reqId !== undefined){
        return true;
    }else{
        return false;
    }
}