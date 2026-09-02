

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

    try {

        const res = await fetch(`${attendanceAPI}/all`, {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        });

        const contentType = res.headers.get("content-type") || "";
        const rawText = await res.text();

        let result;

        if (contentType.includes("application/json")) {
            result = JSON.parse(rawText);
        } else {
            throw new Error(`Attendance API returned ${res.status} ${res.statusText} instead of JSON`);
        }

        if (!res.ok || result.success === false) {
            throw new Error(result.message || "Failed to load attendance");
        }

        // Support both {success:true, attendance:[...]} and a direct array response.
        if (Array.isArray(result)) {
            attendanceData = result;
        } else if (Array.isArray(result.attendance)) {
            attendanceData = result.attendance;
        } else if (Array.isArray(result.data)) {
            attendanceData = result.data;
        } else {
            attendanceData = [];
        }

        displayAttendance(attendanceData);
        updateStats(attendanceData);
        createChart();

    } catch (error) {

        console.error("Attendance Load Error:", error);

        // Do not erase already displayed records if a background refresh fails.
        if (attendanceData.length === 0) {
            displayAttendance([]);
        }

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

// =====================================================
// QR ATTENDANCE SCANNER
// =====================================================

let qrScanner = null;
let qrScannerRunning = false;
let lastQrValue = "";
let lastQrTime = 0;

const qrStatus = document.getElementById("qrScanStatus");
const startQrBtn = document.getElementById("startQrBtn");
const stopQrBtn = document.getElementById("stopQrBtn");
const manualMemberId = document.getElementById("manualMemberId");
const manualScanBtn = document.getElementById("manualScanBtn");

function setQrStatus(message, type = "") {
    if (!qrStatus) return;
    qrStatus.className = `qr-scan-status ${type}`;
    qrStatus.innerHTML = message;
}

async function markAttendanceByMemberId(memberId) {
    const cleanId = String(memberId || "").trim();

    if (!cleanId) {
        setQrStatus("Please enter a valid Member ID.", "error");
        return;
    }

    try {
        setQrStatus('<i class="fa-solid fa-spinner fa-spin"></i> Checking member...', "");

        const response = await fetch(`${attendanceAPI}/scan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberId: cleanId })
        });

        const data = await response.json();

        if (response.ok) {
            setQrStatus(
                `<strong>✓ ${data.member.name}</strong><br>${data.message}<br><small>Check-in: ${data.attendance.checkIn}</small>`,
                "success"
            );

            if (manualMemberId) manualMemberId.value = "";

            // Immediately show the newly created attendance record.
            // This makes the table update even if the follow-up GET request is delayed.
            if (data.attendance) {
                const newRecord = data.attendance;
                const exists = attendanceData.some(item => item._id === newRecord._id);

                if (!exists) {
                    attendanceData = [newRecord, ...attendanceData];
                }

                displayAttendance(attendanceData);
                updateStats(attendanceData);
                createChart();
            }

            // Then sync with the database in the background.
            loadAttendance();
            return true;
        }

        setQrStatus(`<strong>⚠ ${data.message}</strong>`, "error");
        return false;

    } catch (error) {
        console.log("QR Scan Error:", error);
        setQrStatus("Unable to connect to the server.", "error");
        return false;
    }
}

function extractMemberId(decodedText) {
    const text = String(decodedText || "").trim();

    // Our Gym Pro QR format: GYM_PRO|MEM001
    if (text.startsWith("GYM_PRO|")) {
        return text.split("|")[1]?.trim();
    }

    // Also support a plain member ID for future QR cards.
    if (/^MEM\d+$/i.test(text)) {
        return text.toUpperCase();
    }

    // Support JSON QR payloads if needed later.
    try {
        const parsed = JSON.parse(text);
        if (parsed.memberId) return String(parsed.memberId).trim();
    } catch (_) {}

    return null;
}

async function onQrDetected(decodedText) {
    const now = Date.now();

    // Avoid repeated camera callbacks for the same QR.
    if (decodedText === lastQrValue && now - lastQrTime < 3000) return;

    lastQrValue = decodedText;
    lastQrTime = now;

    const memberId = extractMemberId(decodedText);

    if (!memberId) {
        setQrStatus("Invalid Gym Pro QR code. Please scan a member QR.", "error");
        return;
    }

    const success = await markAttendanceByMemberId(memberId);

    if (success) {
        await stopQrScanner();
    }
}

async function startQrScanner() {
    if (!window.Html5Qrcode) {
        setQrStatus("QR scanner library could not load. Use Manual Check-In.", "error");
        return;
    }

    if (qrScannerRunning) return;

    qrScanner = new Html5Qrcode("qr-reader");

    try {
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
            throw new Error("No camera found");
        }

        // Prefer the back camera on phones.
        const backCamera = cameras.find(camera =>
            /back|rear|environment/i.test(camera.label)
        );
        const cameraId = (backCamera || cameras[0]).id;

        await qrScanner.start(
            cameraId,
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1
            },
            onQrDetected,
            () => {}
        );

        qrScannerRunning = true;
        startQrBtn.disabled = true;
        stopQrBtn.disabled = false;
        setQrStatus("Camera active. Point the camera at a Gym Pro member QR code.");

    } catch (error) {
        console.log("Camera Error:", error);
        qrScanner = null;
        qrScannerRunning = false;
        setQrStatus("Camera permission denied/unavailable. You can use Manual Check-In below.", "error");
    }
}

async function stopQrScanner() {
    if (!qrScanner) return;

    try {
        if (qrScannerRunning) {
            await qrScanner.stop();
        }
        await qrScanner.clear();
    } catch (error) {
        console.log("Stop QR Error:", error);
    }

    qrScanner = null;
    qrScannerRunning = false;

    if (startQrBtn) startQrBtn.disabled = false;
    if (stopQrBtn) stopQrBtn.disabled = true;
}

if (startQrBtn) startQrBtn.addEventListener("click", startQrScanner);
if (stopQrBtn) stopQrBtn.addEventListener("click", stopQrScanner);
if (manualScanBtn) manualScanBtn.addEventListener("click", () => markAttendanceByMemberId(manualMemberId.value));
if (manualMemberId) {
    manualMemberId.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            markAttendanceByMemberId(manualMemberId.value);
        }
    });
}

window.addEventListener("beforeunload", () => {
    if (qrScanner) qrScanner.stop().catch(() => {});
});
