

const attendanceAPI = "/attendance";


let attendanceData = [];

let editAttendanceId = null;

let attendanceChart = null;





const attendanceTable =
document.getElementById("attendanceTable");


const attendanceForm =
document.getElementById("attendanceForm");


const presentCount =
document.getElementById("presentCount");


const absentCount =
document.getElementById("absentCount");


const totalAttendance =
document.getElementById("totalAttendance");


const attendancePercent =
document.getElementById("attendancePercent");


const searchAttendance =
document.getElementById("searchAttendance");


const statusFilter =
document.getElementById("statusFilter");



window.addEventListener(
"DOMContentLoaded",
()=>{

    loadAttendance();

});



async function loadAttendance(){


try{


const res =
await fetch(
`${attendanceAPI}/all`
);



attendanceData =
await res.json();



displayAttendance(attendanceData);


updateStats(attendanceData);


createChart();



}


catch(error){


console.log(
"Attendance Error:",
error
);


}



}



function displayAttendance(data){



attendanceTable.innerHTML="";



if(data.length===0){


attendanceTable.innerHTML=`

<tr>

<td colspan="7"
class="text-center">

No Attendance Available

</td>

</tr>

`;


return;


}





data.forEach((item,index)=>{



let statusClass =
item.status==="Present"
?
"present-badge"
:
"absent-badge";





attendanceTable.innerHTML += `



<tr>


<td>

#${index+1}

</td>





<td>


<div class="d-flex align-items-center">


<div class="member-avatar">

${item.memberName
.charAt(0)
.toUpperCase()}

</div>


${item.memberName}


</div>


</td>





<td>

${new Date(item.attendanceDate)
.toLocaleDateString("en-IN")}

</td>





<td>

${item.checkIn || "-"}

</td>





<td>

${item.checkOut || "-"}

</td>





<td>


<span class="status-badge ${statusClass}">

${item.status}

</span>


</td>





<td>


<button

class="action-btn edit-btn"

onclick="editAttendance('${item._id}')">


<i class="fa fa-edit"></i>


</button>





<button

class="action-btn delete-btn"

onclick="deleteAttendance('${item._id}')">


<i class="fa fa-trash"></i>


</button>


</td>


</tr>


`;



});



}


function updateStats(data){



let present=0;

let absent=0;



let today =
new Date()
.toISOString()
.split("T")[0];




data.forEach(item=>{


let date =
new Date(item.attendanceDate)
.toISOString()
.split("T")[0];



if(date===today){



if(item.status==="Present")

present++;


else

absent++;


}



});






presentCount.innerText =
present;



absentCount.innerText =
absent;



totalAttendance.innerText =
data.length;




let percentage =
data.length===0
?
0
:
Math.round(
(present/data.length)*100
);



attendancePercent.innerText =
percentage+"%";



}

attendanceForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();




let attendance={



memberName:

document.getElementById(
"memberName"
).value,





attendanceDate:

document.getElementById(
"attendanceDate"
).value,





checkIn:

document.getElementById(
"checkIn"
).value,





checkOut:

document.getElementById(
"checkOut"
).value,





status:

document.getElementById(
"status"
).value



};






let url =
editAttendanceId
?
`${attendanceAPI}/update/${editAttendanceId}`
:
`${attendanceAPI}/add`;





let method =
editAttendanceId
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
JSON.stringify(attendance)


});





if(res.ok){


alert(
editAttendanceId
?
"Attendance Updated Successfully"
:
"Attendance Added Successfully"
);



bootstrap.Modal
.getInstance(
document.getElementById(
"attendanceModal"
)
)
.hide();



resetAttendanceForm();



loadAttendance();



}



}


catch(error){


console.log(error);


}



});


async function editAttendance(id){



let res =
await fetch(
`${attendanceAPI}/${id}`
);



let data =
await res.json();





editAttendanceId=id;




document.getElementById(
"memberName"
).value =
data.memberName;



document.getElementById(
"attendanceDate"
).value =
new Date(data.attendanceDate)
.toISOString()
.split("T")[0];



document.getElementById(
"checkIn"
).value =
data.checkIn;



document.getElementById(
"checkOut"
).value =
data.checkOut;



document.getElementById(
"status"
).value =
data.status;






document.querySelector(
".modal-header h4"
).innerHTML =

`
<i class="fa fa-edit"></i>

Edit Attendance

`;





new bootstrap.Modal(
document.getElementById(
"attendanceModal"
)
)
.show();



}


async function deleteAttendance(id){



if(!confirm(
"Delete attendance record?"
))

return;





await fetch(

`${attendanceAPI}/delete/${id}`,

{

method:"DELETE"

}

);




loadAttendance();



}


function resetAttendanceForm(){



editAttendanceId=null;


attendanceForm.reset();



document.querySelector(
".modal-header h4"
).innerHTML =

`
<i class="fa-solid fa-calendar-plus"></i>

Add Attendance

`;




document.getElementById(
"attendanceDate"
).value =

new Date()
.toISOString()
.split("T")[0];



}


searchAttendance.addEventListener(
"input",
filterAttendance
);



statusFilter.addEventListener(
"change",
filterAttendance
);





function filterAttendance(){



let search =
searchAttendance.value
.toLowerCase();



let status =
statusFilter.value;






let filtered =

attendanceData.filter(item=>{


return (


item.memberName
.toLowerCase()
.includes(search)



&&



(
status==="All"
||
item.status===status
)



);



});





displayAttendance(filtered);



}

function createChart(){



let canvas =
document.getElementById(
"attendanceChart"
);



if(!canvas)
return;





let present=0;

let absent=0;



attendanceData.forEach(item=>{


if(item.status==="Present")

present++;


else

absent++;



});







if(attendanceChart)

attendanceChart.destroy();





attendanceChart =

new Chart(canvas,{



type:"doughnut",



data:{



labels:[

"Present",

"Absent"

],




datasets:[{


data:[

present,

absent

],


borderWidth:2


}]



},




options:{


responsive:true


}



});



}