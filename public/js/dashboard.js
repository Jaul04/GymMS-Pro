
const statsAPI = "/dashboard/stats";
const membersAPI = "/dashboard/recent-members";
const paymentsAPI = "/dashboard/recent-payments";
const chartsAPI = "/dashboard/charts";


let revenueChart;
let attendanceChart;




window.addEventListener("DOMContentLoaded",()=>{


    loadDashboardStats();

    loadRecentMembers();

    loadRecentPayments();

    loadCharts();

    loadAdminProfile();

    startClock();


});


async function loadDashboardStats(){


try{


const response =
await fetch(statsAPI);


const data =
await response.json();



document.getElementById("totalMembers").innerText =
data.totalMembers || 0;



document.getElementById("activeMembers").innerText =
data.activeMembers || 0;



document.getElementById("todayAttendance").innerText =
data.todayAttendance || 0;



document.getElementById("totalRevenue").innerText =

"₹" +
Number(data.totalRevenue || 0)
.toLocaleString("en-IN");



}

catch(error){

console.log(error);

}


}



async function loadRecentMembers(){


try{


const response =
await fetch(membersAPI);


const members =
await response.json();



const table =
document.getElementById("recentMembers");



table.innerHTML="";



if(members.length===0){


table.innerHTML=`

<tr>

<td colspan="4" class="text-center">

No Members Found

</td>

</tr>

`;

return;


}





members.forEach((member,index)=>{


table.innerHTML +=`

<tr>


<td>#${index+1}</td>


<td>${member.name}</td>


<td>${member.plan || "-"}</td>


<td>

<span class="badge bg-success">

${member.status || "Active"}

</span>

</td>


</tr>

`;


});



}

catch(error){

console.log(error);

}


}


async function loadRecentPayments(){


try{


const response =
await fetch(paymentsAPI);



const payments =
await response.json();



const container =
document.querySelector(".payment-item")
?.parentElement;



if(!container)
return;




container.innerHTML="";



if(payments.length===0){


container.innerHTML=

`
<p class="text-center">
No Payments Found
</p>
`;

return;

}





payments.forEach(payment=>{


container.innerHTML +=`

<div class="payment-item">


<div>

<h6>

${payment.memberName}

</h6>


<small>

${payment.method || "Cash"}

</small>


</div>


<span class="badge bg-success">

₹${Number(payment.amount).toLocaleString("en-IN")}

</span>


</div>


<hr>

`;



});



}

catch(error){

console.log(error);

}


}


async function loadCharts(){


try{


const response =
await fetch(chartsAPI);



const data =
await response.json();



createRevenueChart(data.revenue);


createAttendanceChart(data.attendance);



}

catch(error){

console.log(error);

}


}









function createRevenueChart(data){


const ctx =
document.getElementById("revenueChart");


if(!ctx)return;



if(revenueChart){

revenueChart.destroy();

}



revenueChart =
new Chart(ctx,{

type:"line",


data:{


labels:data.map(
item=>item.month
),


datasets:[{

label:"Revenue",

data:data.map(
item=>item.amount
),

borderWidth:3,

tension:0.4


}]


},


options:{

responsive:true

}


});


}









function createAttendanceChart(data){


const ctx =
document.getElementById("attendanceChart");


if(!ctx)return;



if(attendanceChart){

attendanceChart.destroy();

}



attendanceChart =
new Chart(ctx,{

type:"doughnut",


data:{


labels:[

"Present",

"Absent"

],


datasets:[{

data:[

data.present,

data.absent

],


borderWidth:1


}]


},


options:{

responsive:true

}


});


}





function startClock(){


setInterval(()=>{


const clock =
document.getElementById("liveClock");



if(clock){


clock.innerText =
new Date()
.toLocaleTimeString();


}



},1000);


}


async function loadAdminProfile(){


try{


const response =
await fetch("/admin-profile");



const data =
await response.json();



if(data.success){



const name =
data.admin.name;



const email =
data.admin.email;



const img =
document.getElementById("adminImage");



const adminName =
document.getElementById("adminName");



const adminEmail =
document.getElementById("adminEmail");



const menuName =
document.getElementById("menuAdminName");



const menuEmail =
document.getElementById("menuAdminEmail");




if(adminName)
adminName.innerText=name;



if(adminEmail)
adminEmail.innerText=email;



if(menuName)
menuName.innerText=name;



if(menuEmail)
menuEmail.innerText=email;



if(img)

img.src =
`https://ui-avatars.com/api/?name=${name}&background=f4b400&color=000`;



}



}

catch(error){

console.log(error);

}


}