

const API = "/payments";


let payments = [];

let editId = null;

let revenueChart = null;



const paymentTable =
document.getElementById("paymentTable");

const memberSelect =
document.getElementById("memberName");

const paymentStatus =
document.getElementById("paymentStatus");

const paymentForm =
document.getElementById("paymentForm");


const totalRevenue =
document.getElementById("totalRevenue");


const todayRevenue =
document.getElementById("todayRevenue");


const paymentCount =
document.getElementById("paymentCount");


const upiCount =
document.getElementById("upiCount");


const searchPayment =
document.getElementById("searchPayment");


const paymentFilter =
document.getElementById("paymentFilter");

window.addEventListener(
"DOMContentLoaded",
()=>{

    loadPayments();

    loadMembers();

});

async function loadPayments(){


try{


const res =
await fetch(
`${API}/all`
);



payments =
await res.json();



displayPayments(payments);


updateStats(payments);


createRevenueChart();



}

catch(err){


console.log(err);


}


}


function displayPayments(data){



paymentTable.innerHTML="";



if(data.length===0){


paymentTable.innerHTML=`

<tr>

<td colspan="6"
class="text-center">

No Payments Available

</td>

</tr>

`;

return;


}





data.forEach((payment,index)=>{


let badge="card-badge";



if(payment.method==="Cash")
badge="cash-badge";



if(payment.method==="UPI")
badge="upi-badge";






paymentTable.innerHTML += `



<tr>


<td>
#${index+1}
</td>



<td>


<div class="d-flex align-items-center">


<div class="member-avatar">

${payment.memberName
.charAt(0)
.toUpperCase()}

</div>


${payment.memberName}


</div>


</td>




<td>

₹${payment.amount}

</td>




<td>

${new Date(payment.paymentDate)
.toLocaleDateString("en-IN")}

</td>





<td>

<span class="method-badge ${badge}">

${payment.method}

</span>


</td>





<td>


<button
class="action-btn edit-btn"
onclick="editPayment('${payment._id}')">

<i class="fa fa-edit"></i>

</button>



<button
class="action-btn delete-btn"
onclick="deletePayment('${payment._id}')">

<i class="fa fa-trash"></i>

</button>


</td>


</tr>



`;



});



}


function updateStats(data){



let total=0;

let today=0;

let upi=0;



let todayDate =
new Date()
.toISOString()
.split("T")[0];





data.forEach(payment=>{


total += Number(payment.amount);



if(payment.method==="UPI")
upi++;




let date =
new Date(payment.paymentDate)
.toISOString()
.split("T")[0];



if(date===todayDate)
today += Number(payment.amount);



});




totalRevenue.innerText =
"₹"+total;



todayRevenue.innerText =
"₹"+today;



paymentCount.innerText =
data.length;



upiCount.innerText =
upi;



}


paymentForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();




let payment={


memberName:
document.getElementById("memberName").value,


amount:
document.getElementById("amount").value,


paymentDate:
document.getElementById("paymentDate").value,


method:
document.getElementById("paymentMethod").value


};





let url =
editId
?
`${API}/update/${editId}`
:
`${API}/add`;



let method =
editId
?
"PUT"
:
"POST";





try{


let res =
await fetch(url,{

method:method,

headers:{

"Content-Type":
"application/json"

},


body:
JSON.stringify(payment)


});




if(res.ok){



alert(
editId
?
"Payment Updated"
:
"Payment Added"
);



bootstrap.Modal
.getInstance(
document.getElementById("paymentModal")
)
.hide();



resetPaymentForm();



loadPayments();



}



}


catch(err){


console.log(err);


}


});


async function editPayment(id){



let res =
await fetch(
`${API}/${id}`
);



let payment =
await res.json();




editId=id;



document.getElementById("memberName").value =
payment.memberName;


document.getElementById("amount").value =
payment.amount;


document.getElementById("paymentDate").value =
new Date(payment.paymentDate)
.toISOString()
.split("T")[0];



document.getElementById("paymentMethod").value =
payment.method;




document.querySelector(
".modal-header h4"
).innerHTML =
`
<i class="fa fa-edit"></i>
Edit Payment
`;



new bootstrap.Modal(
document.getElementById("paymentModal")
)
.show();



}


async function deletePayment(id){



if(!confirm(
"Delete this payment?"
))
return;



await fetch(
`${API}/delete/${id}`,
{

method:"DELETE"

}
);



loadPayments();



}

function resetPaymentForm(){



editId=null;


paymentForm.reset();



document.querySelector(
".modal-header h4"
).innerHTML =
`
<i class="fa-solid fa-money-check-dollar"></i>
Add Payment
`;



document.getElementById(
"paymentDate"
).value =
new Date()
.toISOString()
.split("T")[0];



}


searchPayment.addEventListener(
"input",
filterPayments
);



paymentFilter.addEventListener(
"change",
filterPayments
);



function filterPayments(){



let search =
searchPayment.value
.toLowerCase();



let method =
paymentFilter.value;





let filtered =
payments.filter(p=>{


return (

p.memberName
.toLowerCase()
.includes(search)

&&

(
method==="All"
||
p.method===method
)


);


});



displayPayments(filtered);



}



function createRevenueChart(){



let canvas =
document.getElementById(
"revenueChart"
);



if(!canvas)
return;




let data={};




payments.forEach(p=>{


let month =
new Date(p.paymentDate)
.toLocaleString(
"en-IN",
{
month:"short"
}
);



if(!data[month])
data[month]=0;



data[month]+=Number(p.amount);



});





if(revenueChart)
revenueChart.destroy();





revenueChart =
new Chart(canvas,{


type:"line",


data:{


labels:
Object.keys(data),



datasets:[{


label:"Revenue",


data:
Object.values(data),


borderWidth:3,


tension:.4



}]



},


options:{


responsive:true


}



});



}

async function loadMembers(){

    try{

        const res =
        await fetch("/members/all");


        const members =
        await res.json();


        memberSelect.innerHTML =
        `
        <option value="">
        Select Member
        </option>
        `;


        members.forEach(member=>{


            memberSelect.innerHTML +=
            `

            <option value="${member.name}">
            
            ${member.name}

            </option>

            `;


        });


    }
    catch(err){

        console.log(err);

    }


}