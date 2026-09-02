
// ======================================
// PAYMENT MANAGEMENT JS
// GymMS Pro
// ======================================


// ===============================
// API URLS
// ===============================


const PAYMENT_API = "/payments";

const MEMBER_API = "/members/all";




// ===============================
// GLOBAL VARIABLES
// ===============================


let payments = [];

let members = [];





// ===============================
// DOM ELEMENTS
// ===============================


const paymentTable =
document.getElementById("paymentTable");


const memberSelect =
document.getElementById("memberSelect");


const paymentForm =
document.getElementById("paymentForm");


const paymentSearch =
document.getElementById("paymentSearch");


const paymentFilter =
document.getElementById("paymentFilter");




const totalPayments =
document.getElementById("totalPayments");


const totalRevenue =
document.getElementById("totalRevenue");


const onlinePayments =
document.getElementById("onlinePayments");


const offlinePayments =
document.getElementById("offlinePayments");






// ===============================
// PAGE LOAD
// ===============================


document.addEventListener(
"DOMContentLoaded",
()=>{


    setTodayDate();


    loadMembers();


    loadPayments();


});







// ===============================
// SET TODAY DATE
// ===============================


function setTodayDate(){


const date =
document.getElementById(
"paymentDate"
);



if(date){


date.value =
new Date()
.toISOString()
.split("T")[0];


}


}

// ======================================
// LOAD MEMBERS
// ======================================


async function loadMembers(){


    try{


        const response =
        await fetch(MEMBER_API);



        const data =
        await response.json();



        members =
        data.members || data;



        memberSelect.innerHTML = `

        <option value="">
        Select Member
        </option>

        `;



        members.forEach(member=>{


            memberSelect.innerHTML += `


            <option value="${member._id}">

            ${member.name} - ${member.phone}

            </option>


            `;


        });



    }


    catch(error){


        console.log(
            "Members Load Error:",
            error
        );


    }


}







// ======================================
// LOAD PAYMENTS
// ======================================


async function loadPayments(){


    try{


        const response =
        await fetch(
            PAYMENT_API+"/all"
        );



        const data =
        await response.json();



        payments =
        data.payments || [];



        renderPayments();



        updateStats();



    }


    catch(error){


        console.log(
            "Payment Load Error:",
            error
        );


    }


}








// ======================================
// RENDER PAYMENT TABLE
// ======================================


function renderPayments(){


    paymentTable.innerHTML="";



    if(payments.length===0){


        paymentTable.innerHTML=`

        <tr>

        <td colspan="9"
        class="text-center">

        No Payments Found

        </td>

        </tr>

        `;


        return;


    }





    payments.forEach(
    (payment,index)=>{



        paymentTable.innerHTML += `


        <tr>


        <td>
        ${index+1}
        </td>



        <td>

        ${payment.memberName}

        <br>

        <small>

        ${payment.memberPhone || ""}

        </small>

        </td>



        <td>

        ${payment.plan}

        </td>




        <td>

        ₹${Number(payment.amount)
        .toLocaleString("en-IN")}

        </td>




        <td>

        ${payment.paymentMode}

        </td>




        <td>

        ${payment.source}

        </td>




        <td>


        <span class="badge bg-success">

        ${payment.paymentStatus}

        </span>


        </td>




        <td>

        ${new Date(
        payment.paymentDate
        )
        .toLocaleDateString("en-IN")}

        </td>




        <td>


        <button

        class="action-btn action-view"

        onclick="viewPayment('${payment._id}')">

        <i class="fa fa-eye"></i>

        </button>




        <button

        class="action-btn action-edit"

        onclick="editPayment('${payment._id}')">

        <i class="fa fa-pen"></i>

        </button>




        <button

        class="action-btn action-delete"

        onclick="deletePayment('${payment._id}')">

        <i class="fa fa-trash"></i>

        </button>




        <button

        class="action-btn action-receipt"

        onclick="downloadReceipt('${payment._id}')">

        <i class="fa fa-file"></i>

        </button>



        </td>



        </tr>


        `;



    });



}








// ======================================
// UPDATE STATISTICS
// ======================================


function updateStats(){


    totalPayments.innerText =
    payments.length;



    let revenue=0;

    let online=0;

    let offline=0;



    payments.forEach(payment=>{


        revenue +=
        Number(payment.amount);



        if(payment.source==="Online"){

            online++;

        }


        if(payment.source==="Offline"){

            offline++;

        }



    });





    totalRevenue.innerText =
    "₹"+
    revenue.toLocaleString("en-IN");



    onlinePayments.innerText =
    online;



    offlinePayments.innerText =
    offline;



}
// ======================================
// MEMBER SELECT CHANGE
// ======================================


memberSelect.addEventListener(
"change",
()=>{


    const memberId =
    memberSelect.value;



    const member =
    members.find(
        m=>m._id===memberId
    );



    if(member){


        document.getElementById(
            "paymentPlan"
        ).value =
        member.plan || "";



        document.getElementById(
            "paymentAmount"
        ).value =
        member.amount || "";



    }



});







// ======================================
// ADD PAYMENT
// ======================================


paymentForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();




const memberId =
memberSelect.value;



const member =
members.find(
m=>m._id===memberId
);





if(!member){


    alert(
    "Please select member"
    );


    return;


}





const paymentData={


    memberId:member._id,


    memberName:member.name,


    memberEmail:member.email,


    memberPhone:member.phone,


    plan:
    document.getElementById(
    "paymentPlan"
    ).value,



    amount:Number(
    document.getElementById(
    "paymentAmount"
    ).value
    ),



    paymentMode:
    document.getElementById(
    "paymentMode"
    ).value,



    paymentStatus:
    document.getElementById(
    "paymentStatus"
    ).value,


    source:"Offline",


    paymentDate:
    document.getElementById(
    "paymentDate"
    ).value



};







try{

let url =
PAYMENT_API + "/add";


let method = "POST";


const editId =
document.getElementById(
"paymentId"
).value;



if(editId){

    url =
    PAYMENT_API +
    "/update/" +
    editId;


    method = "PUT";

}




const response =
await fetch(
url,
{

method:method,

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify(paymentData)

});






const data =
await response.json();






if(data.success){



alert(
"Payment Added Successfully"
);




paymentForm.reset();




setTodayDate();




loadPayments();





}

else{


alert(
data.message
);


}





}



catch(error){


console.log(
"Add Payment Error:",
error
);


alert(
"Server Error"
);


}



});

// ======================================
// SEARCH PAYMENT
// ======================================


paymentSearch.addEventListener(
"keyup",
()=>{


const keyword =
paymentSearch.value
.toLowerCase();



const filtered =
payments.filter(payment=>{


return (

payment.memberName
.toLowerCase()
.includes(keyword)



||

payment.plan
.toLowerCase()
.includes(keyword)



||

payment.paymentMode
.toLowerCase()
.includes(keyword)



||

payment.source
.toLowerCase()
.includes(keyword)



);


});



renderPaymentList(filtered);



});








// ======================================
// FILTER PAYMENT
// ======================================


paymentFilter.addEventListener(
"change",
()=>{


const value =
paymentFilter.value;




if(value==="All"){


renderPayments();


return;


}




const filtered =
payments.filter(payment=>{


return (

payment.source===value

||

payment.paymentStatus===value

);


});




renderPaymentList(filtered);



});








// ======================================
// RENDER FILTER DATA
// ======================================


function renderPaymentList(list){


paymentTable.innerHTML="";



if(list.length===0){


paymentTable.innerHTML=`

<tr>

<td colspan="9"
class="text-center">

No Payments Found

</td>

</tr>

`;

return;


}




list.forEach(
(payment,index)=>{


paymentTable.innerHTML +=`

<tr>


<td>${index+1}</td>


<td>

${payment.memberName}

<br>

<small>

${payment.memberPhone || ""}

</small>

</td>


<td>${payment.plan}</td>


<td>

₹${Number(payment.amount)
.toLocaleString("en-IN")}

</td>


<td>${payment.paymentMode}</td>


<td>${payment.source}</td>



<td>


<span class="badge bg-success">

${payment.paymentStatus}

</span>


</td>



<td>

${new Date(payment.paymentDate)
.toLocaleDateString("en-IN")}

</td>




<td>


<button

class="action-btn action-view"

onclick="viewPayment('${payment._id}')">

<i class="fa fa-eye"></i>

</button>




<button

class="action-btn action-delete"

onclick="deletePayment('${payment._id}')">

<i class="fa fa-trash"></i>

</button>


</td>


</tr>


`;



});



}








// ======================================
// DELETE PAYMENT
// ======================================


async function deletePayment(id){



const confirmDelete =
confirm(
"Are you sure you want to delete?"
);



if(!confirmDelete)
return;





try{


const response =
await fetch(

PAYMENT_API+
"/delete/"+
id,

{


method:"DELETE"


}

);





const data =
await response.json();





if(data.success){


alert(
"Payment Deleted"
);



loadPayments();



}


else{


alert(
data.message
);


}



}



catch(error){


console.log(error);


}



}









// ======================================
// VIEW PAYMENT
// ======================================


function viewPayment(id){


const payment =
payments.find(
p=>p._id===id
);



if(!payment)
return;




alert(

`
Member : ${payment.memberName}

Plan : ${payment.plan}

Amount : ₹${payment.amount}

Mode : ${payment.paymentMode}

Source : ${payment.source}

Status : ${payment.paymentStatus}

Date : ${new Date(payment.paymentDate)
.toLocaleDateString()}

`

);



}

// ======================================
// EDIT PAYMENT
// ======================================


function editPayment(id){


const payment =
payments.find(
p=>p._id===id
);



if(!payment)
return;




// open modal

const modal =
new bootstrap.Modal(
document.getElementById(
"paymentModal"
)
);


modal.show();





// fill data


document.getElementById(
"paymentId"
).value =
payment._id;




document.getElementById(
"paymentPlan"
).value =
payment.plan;




document.getElementById(
"paymentAmount"
).value =
payment.amount;




document.getElementById(
"paymentMode"
).value =
payment.paymentMode;




document.getElementById(
"paymentStatus"
).value =
payment.paymentStatus;



document.getElementById(
"paymentDate"
).value =
new Date(payment.paymentDate)
.toISOString()
.split("T")[0];





// select member

document.getElementById(
"memberSelect"
).value =
payment.memberId;



}
// ======================================
// RECEIPT
// ======================================

function downloadReceipt(id){


window.open(

"/payments/receipt/"+id,

"_blank"

);


}
// ======================================
// PRINT RECEIPT
// ======================================

document
.getElementById("printReceipt")
.addEventListener(
"click",
()=>{


window.print();


});

// ======================================
// PRINT RECEIPT
// ======================================

document
.getElementById("printReceipt")
.addEventListener(
"click",
()=>{


window.print();


});
// ======================================
// EXPORT EXCEL
// ======================================


document
.getElementById("exportExcel")
.addEventListener(
"click",
()=>{


let csv="";



csv +=
"Member,Plan,Amount,Mode,Status,Date\n";



payments.forEach(payment=>{


csv +=

`${payment.memberName},${payment.plan},${payment.amount},${payment.paymentMode},${payment.paymentStatus},${payment.paymentDate}\n`;


});





const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);



const url =
URL.createObjectURL(blob);



const a =
document.createElement("a");


a.href=url;


a.download=
"payments.csv";


a.click();



});