const API = "/payments";
const RAZORPAY_KEY = "rzp_live_THJJ0lbmFICoWk";


let payments = [];
let membersList = [];
let editId = null;
let revenueChart = null;


const paymentTable = document.getElementById("paymentTable");
const memberSelect = document.getElementById("memberName");
const paymentForm = document.getElementById("paymentForm");

const totalRevenue = document.getElementById("totalRevenue");
const todayRevenue = document.getElementById("todayRevenue");
const paymentCount = document.getElementById("paymentCount");
const upiCount = document.getElementById("upiCount");



window.addEventListener("DOMContentLoaded", () => {


    document.getElementById("paymentDate").value =
        new Date().toISOString().split("T")[0];


    loadMembers();

    loadPayments();


});



// ===============================
// LOAD MEMBERS
// ===============================

async function loadMembers(){


    try{


        const res = await fetch("/members/all");

        const data = await res.json();


        console.log("Members:",data);



        if(!data.success){

            return;

        }



        membersList = data.members;



        memberSelect.innerHTML =
        `<option value="">Select Member</option>`;



        data.members.forEach(member=>{


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




// ===============================
// LOAD PAYMENTS
// ===============================

async function loadPayments(){


    try{


        const res = await fetch(`${API}/all`);

        const data = await res.json();



        if(data.success){

            payments = data.payments;

        }
        else{

            payments=[];

        }



        displayPayments(payments);

        updateStats(payments);



    }
    catch(err){

        console.log(err);

    }


}





// ===============================
// DISPLAY PAYMENTS
// ===============================

function displayPayments(data){


    paymentTable.innerHTML="";



    if(data.length===0){


        paymentTable.innerHTML =

        `
        <tr>

        <td colspan="6" class="text-center">

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



        paymentTable.innerHTML +=


        `

        <tr>

        <td>#${index+1}</td>


        <td>${payment.memberName}</td>


        <td>₹${payment.amount}</td>



        <td>

        ${new Date(payment.paymentDate)
        .toLocaleDateString("en-IN")}

        </td>



        <td>

        <span class="${badge}">

        ${payment.method}

        </span>


        </td>



        <td>


        <button
        class="btn btn-sm btn-primary"
        onclick="editPayment('${payment._id}')">

        Edit

        </button>



        <button
        class="btn btn-sm btn-danger"
        onclick="deletePayment('${payment._id}')">

        Delete

        </button>



        </td>


        </tr>


        `;


    });



}





// ===============================
// UPDATE STATS
// ===============================

function updateStats(data){


    let total=0;

    let today=0;

    let upi=0;



    const todayDate =
    new Date().toISOString().split("T")[0];



    data.forEach(payment=>{


        total += Number(payment.amount);



        if(payment.method==="UPI")
            upi++;



        const date =
        new Date(payment.paymentDate)
        .toISOString()
        .split("T")[0];



        if(date===todayDate){

            today += Number(payment.amount);

        }


    });



    totalRevenue.innerText="₹"+total;

    todayRevenue.innerText="₹"+today;

    paymentCount.innerText=data.length;

    upiCount.innerText=upi;



}





// ===============================
// SAVE PAYMENT
// ===============================


paymentForm.addEventListener("submit",async(e)=>{


    e.preventDefault();



    const selectedMember = membersList.find(

        m=>m.name===memberSelect.value

    );



    if(!selectedMember){


        alert("Please select member");

        return;


    }




    const payment = {



        memberName:selectedMember.name,


        memberEmail:selectedMember.email,


        memberPhone:selectedMember.phone,


        plan:selectedMember.plan,


        amount:Number(
            document.getElementById("amount").value
        ),



        paymentDate:
        document.getElementById("paymentDate").value,



        method:
        document.getElementById("paymentMethod").value,



        status:"Completed"


    };



    console.log("PAYMENT DATA RECEIVED:",payment);




    let url=`${API}/add`;

    let method="POST";



    if(editId){


        url=`${API}/update/${editId}`;

        method="PUT";


    }




    try{


        const res = await fetch(url,{


            method,


            headers:{


                "Content-Type":"application/json"


            },


            body:JSON.stringify(payment)



        });



        const data = await res.json();



        console.log(data);



        alert(data.message);



        if(data.success){



            const modal =
            bootstrap.Modal.getInstance(
                document.getElementById("paymentModal")
            );



            if(modal)
                modal.hide();



            paymentForm.reset();



            editId=null;



            loadPayments();



        }



    }
    catch(err){


        console.log(err);


    }



});







// ===============================
// EDIT PAYMENT
// ===============================


async function editPayment(id){


    try{


        const res =
        await fetch(`${API}/${id}`);



        const payment =
        await res.json();



        editId=id;



        memberSelect.value =
        payment.memberName;



        document.getElementById("amount").value =
        payment.amount;



        document.getElementById("paymentDate").value =

        new Date(payment.paymentDate)
        .toISOString()
        .split("T")[0];



        document.getElementById("paymentMethod").value =
        payment.method;



        new bootstrap.Modal(

            document.getElementById("paymentModal")

        ).show();



    }
    catch(err){

        console.log(err);

    }


}







// ===============================
// DELETE PAYMENT
// ===============================


async function deletePayment(id){


    if(!confirm("Delete Payment?"))

        return;



    await fetch(`${API}/delete/${id}`,{


        method:"DELETE"


    });



    loadPayments();


}