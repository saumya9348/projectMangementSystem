let allProductsArr={};

function getProducts(){
    fetch("http://localhost:8001/products")
    .then( ( products ) => products.json())
    .then( (allProduts) => {
        allProductsArr = allProduts;
        getAllProducts();
    })
}

function getAllProducts(){

        let tbody=document.getElementById("tbody");
        tbody.innerHTML='';
        allProductsArr.forEach((product,index)=>{
            let prRow=document.createElement("tr");

            let slTD=document.createElement("td");
            slTD.append(++index);

            let nameTD=document.createElement("td");
            nameTD.append(product.name);

            let priceTD=document.createElement("td");
            priceTD.append(product.price);

            let quantTD=document.createElement("td");
            quantTD.append(product.quantity);

            let acttionTD=document.createElement("td");

            let edit=document.createElement("i");
            edit.className="icon fa-solid fa-pen-to-square text-success";
            acttionTD.appendChild(edit);
            edit.addEventListener("click",()=>{
                editProduct(product.id);
            })

            let deleteP=document.createElement("i");
            deleteP.className="icon fa-solid fa-trash-can text-danger";
            acttionTD.appendChild(deleteP);
            deleteP.addEventListener("click",()=>{
                deleteProduct(product.id,getAllProducts);
            })

            prRow.appendChild(slTD);
            prRow.appendChild(nameTD);
            prRow.appendChild(priceTD);
            prRow.appendChild(quantTD);
            prRow.appendChild(acttionTD);

            tbody.appendChild(prRow)

        }) // end allProducts forEach


}
getProducts();

async function addProduct(){
    // event.preventDefault();
    let data={};
    data.id=document.getElementById("productID").value;
    data.name=document.getElementById("productName").value;
    data.price=document.getElementById("addPrice").value;
    data.quantity=document.getElementById("addQuantity").value;
    console.log(document.getElementById("productID").value);
    let addData = await fetch("http://localhost:8001/products",{
        method:"POST",
        body:JSON.stringify(data)
    })
    let resAdddata =  await addData.json();
    
    allProductsArr.push(data);
    getAllProducts();
    console.log(resAdddata);
}

function editProduct(b){
    let editDisplayDiv=document.getElementsByClassName("editProdut")[0];
    editDisplayDiv.style.display="block";
    document.getElementsByClassName("closeBtn")[0].addEventListener("click",()=>{
        closeEditDiv();
    });


    let pname= document.getElementById("pname");
    let price= document.getElementById("price");
    let quantity= document.getElementById("quantity");

    fetch("http://localhost:8001/products?id="+b)
    .then((data)=>data.json())
    .then((product)=>{
        pname.value=product.name;
        price.value=product.price;
        quantity.value=product.quantity;
        console.log(product);
    })

    document.getElementById("edit").addEventListener("click",(e)=>{
        e.preventDefault();
        updateProduct(b,getAllProducts);
        closeEditDiv();
    })
    
}

function deleteProduct(id , callBack){
    fetch("http://localhost:8001/products?id="+id ,{
        method:"DELETE"
    })
    .then((data)=>data.json())
    .then((message)=>{
        let findId = allProductsArr.findIndex((ele,ind) => ele.id===id );
        allProductsArr.splice(findId,1);
        callBack();
    });
}

function updateProduct(id,callBack){
    let pname= document.getElementById("pname").value;
    let price= document.getElementById("price").value;
    let quantity= document.getElementById("quantity").value;
    let data=JSON.stringify({
        name:pname,
        price:price,
        quantity:quantity
    });
    fetch("http://localhost:8001/products?id="+id ,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:data
    })
    .then((data)=>data.json())
    .then((message)=>{
        let findId = allProductsArr.findIndex((ele,ind) => ele.id===id );
        allProductsArr[findId].name=pname;
        allProductsArr[findId].price=price;
        allProductsArr[findId].quantity=quantity;
        callBack();
    });
}

function closeEditDiv(){
    let editDisplayDiv=document.getElementsByClassName("editProdut")[0];
    editDisplayDiv.style.display="none";
}