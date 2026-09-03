const trainerForm = document.getElementById("trainerForm");
const trainerTable = document.getElementById("trainerTable");
let trainersData = [];

async function loadTrainers(){
    try{const response=await fetch("/trainers");const data=await response.json();if(data.success){trainersData=data.trainers;displayTrainers(trainersData);updateStats(trainersData);}}
    catch(error){console.log(error);}
}

function displayTrainers(trainers){
    trainerTable.innerHTML="";
    if(!trainers.length){trainerTable.innerHTML=`<tr><td colspan="8" class="text-center">No Trainers Available</td></tr>`;return;}
    trainers.forEach(trainer=>{
        const first=(trainer.name||"T").charAt(0).toUpperCase();
        const photo=trainer.profilePhoto?`<img src="${trainer.profilePhoto}" style="width:38px;height:38px;border-radius:50%;object-fit:cover">`:`<span class="mini-avatar">${first}</span>`;
        trainerTable.innerHTML+=`<tr><td>${trainer.trainerId}</td><td><div class="d-flex align-items-center gap-2">${photo}<div><strong>${escapeHtml(trainer.name)}</strong><div class="small text-muted">${escapeHtml(trainer.email||"")}</div></div></div></td><td>${escapeHtml(trainer.phone)}</td><td>${escapeHtml(trainer.specialization)}</td><td>${trainer.experience||0} Years</td><td>₹${trainer.salary||0}</td><td><span class="badge bg-success">${escapeHtml(trainer.status)}</span></td><td><button class="btn btn-outline-dark btn-sm me-1" title="View Profile" onclick="viewTrainerProfile('${trainer._id}')"><i class="fa-solid fa-eye"></i></button><button class="btn btn-danger btn-sm" onclick="deleteTrainer('${trainer._id}')"><i class="fa-solid fa-trash"></i></button></td></tr>`;
    });
}

trainerForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const photoFile=document.getElementById("profilePhoto")?.files?.[0];
    if(photoFile&&photoFile.size>5*1024*1024)return alert("Profile photo must be under 5MB");
    const trainer={trainerId:document.getElementById("trainerId").value.trim(),name:document.getElementById("name").value.trim(),email:document.getElementById("email").value.trim(),phone:document.getElementById("phone").value.trim(),gender:document.getElementById("gender")?.value||"",dob:document.getElementById("dob")?.value||"",address:document.getElementById("address")?.value.trim()||"",bio:document.getElementById("bio")?.value.trim()||"",specialization:document.getElementById("specialization").value.trim(),experience:document.getElementById("experience").value,salary:document.getElementById("salary").value,profilePhoto:photoFile?await fileToDataUrl(photoFile):""};
    try{const response=await fetch("/trainers/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(trainer)});const data=await response.json();if(data.success){alert("Trainer Added Successfully");trainerForm.reset();const modal=bootstrap.Modal.getInstance(document.getElementById("trainerModal"));if(modal)modal.hide();loadTrainers();}else alert(data.message||"Failed to add trainer");}catch(error){console.log(error);alert("Server Error");}
});

async function deleteTrainer(id){if(!confirm("Delete this trainer?"))return;try{const response=await fetch(`/trainers/${id}`,{method:"DELETE"});const data=await response.json();if(data.success){alert("Trainer Deleted");loadTrainers();}else alert(data.message||"Delete failed");}catch(error){console.log(error);}}

document.getElementById("searchTrainer")?.addEventListener("keyup",function(){const value=this.value.toLowerCase();displayTrainers(trainersData.filter(t=>(t.name||"").toLowerCase().includes(value)||(t.phone||"").includes(value)||(t.specialization||"").toLowerCase().includes(value)));});
function updateStats(data){document.getElementById("trainerCount").innerText=data.length;document.getElementById("activeTrainer").innerText=data.filter(t=>t.status==="Active").length;document.getElementById("specialistCount").innerText=new Set(data.map(t=>t.specialization)).size;const total=data.reduce((n,t)=>n+Number(t.experience||0),0);document.getElementById("experienceCount").innerText=data.length?Math.round(total/data.length)+" Yr":"0";}
function escapeHtml(value){return String(value??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));}
function fileToDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
window.addEventListener("DOMContentLoaded",loadTrainers);
