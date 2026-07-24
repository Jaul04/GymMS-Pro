
const memberForm = document.getElementById("memberForm");


window.addEventListener("DOMContentLoaded", () => {

    loadMembers();

    updateStatistics();

});

document
.getElementById("searchMember")
.addEventListener("keyup",searchMember);


memberForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const member={

        name:document.getElementById("name").value,

        email:document.getElementById("email").value,

        phone:document.getElementById("phone").value,

        plan:document.getElementById("plan").value,

        joinDate:document.getElementById("joinDate").value,

        expiryDate:document.getElementById("expiryDate").value

    };

    const id=memberForm.dataset.id;

    let url="/members/add";

    let method="POST";

    if(id){

        url=`/members/update/${id}`;

        method="PUT";

    }

    try{

        const response=await fetch(url,{

            method,

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(member)

        });

        const data=await response.json();

        alert(data.message);

        if(data.success){

            const modal=bootstrap.Modal.getInstance(

                document.getElementById("memberModal")

            );

            modal.hide();

            memberForm.reset();

            delete memberForm.dataset.id;

            document.querySelector(".modal-header h4").innerHTML=
            `<i class="fa-solid fa-user-plus"></i> Add Member`;

            loadMembers();

            updateStatistics();

        }

    }

    catch(error){

        console.log(error);

    }

});

async function loadMembers(){

    try{

        const response = await fetch("/members/all");

        const members = await response.json();

        const table = document.getElementById("memberTable");

        table.innerHTML = "";

        if(members.length===0){

            table.innerHTML=`

            <tr>

                <td colspan="6" class="text-center py-5">

                    <i class="fa-solid fa-users fa-3x text-secondary mb-3"></i>

                    <h5>No Members Found</h5>

                </td>

            </tr>

            `;

            return;

        }

        members.forEach(member=>{

            const statusClass =
                member.status==="Active"
                ? "status-active"
                : "status-expired";

            const firstLetter = member.name.charAt(0).toUpperCase();

            table.innerHTML += `

            <tr>

                <td>

                    <strong>${member.memberId}</strong>

                </td>

                <td>

                    <div class="member-info">

                        <div class="member-avatar">

                            ${firstLetter}

                        </div>

                        <div>

                            <h6>${member.name}</h6>

                            <small>${member.email}</small>

                        </div>

                    </div>

                </td>

                <td>${member.phone}</td>

                <td>

                    <span class="badge bg-warning text-dark">

                        ${member.plan}

                    </span>

                </td>

                <td>

                    <span class="${statusClass}">

                        ${member.status}

                    </span>

                </td>

                <td>

                    <button
                        class="action-btn view-btn"
                        title="View"
                        onclick="viewMember('${member._id}')">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        class="action-btn edit-btn"
                        title="Edit"
                        onclick="editMember('${member._id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="action-btn delete-btn"
                        title="Delete"
                        onclick="deleteMember('${member._id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}


async function updateStatistics(){

    try{

        const response = await fetch("/members/all");

        const members = await response.json();

        document.getElementById("memberCount").innerHTML =
        members.length;

        const active =
        members.filter(m=>m.status==="Active").length;

        document.getElementById("activeCount").innerHTML =
        active;

        document.getElementById("expiredCount").innerHTML =
        members.length-active;

        const premium =
        members.filter(m=>m.plan==="Yearly").length;

        document.getElementById("premiumCount").innerHTML =
        premium;

    }

    catch(error){

        console.log(error);

    }

}

async function editMember(id){

    try{

        const response = await fetch("/members/all");

        const members = await response.json();

        const member = members.find(m => m._id === id);

        if(!member) return;

        document.getElementById("name").value = member.name;
        document.getElementById("email").value = member.email;
        document.getElementById("phone").value = member.phone;
        document.getElementById("plan").value = member.plan;
        document.getElementById("joinDate").value =
        member.joinDate.split("T")[0];
        document.getElementById("expiryDate").value =
        member.expiryDate.split("T")[0];

        memberForm.dataset.id = id;

        document.querySelector(".modal-header h4").innerHTML =
        `<i class="fa-solid fa-user-pen"></i> Edit Member`;

        new bootstrap.Modal(
            document.getElementById("memberModal")
        ).show();

    }

    catch(error){

        console.log(error);

    }

}


async function viewMember(id){

    try{

        const response = await fetch(`/members/${id}`);

        const member = await response.json();

        const joinDate =
        new Date(member.joinDate).toLocaleDateString("en-GB");

        const expiryDate =
        new Date(member.expiryDate).toLocaleDateString("en-GB");

        alert(

`🏋 MEMBER DETAILS

ID : ${member.memberId}

Name : ${member.name}

Email : ${member.email}

Phone : ${member.phone}

Plan : ${member.plan}

Status : ${member.status}

Join Date : ${joinDate}

Expiry Date : ${expiryDate}`

        );

    }

    catch(error){

        console.log(error);

    }

}


async function deleteMember(id){

    if(!confirm("Delete this member?")) return;

    try{

        const response = await fetch(`/members/delete/${id}`,{

            method:"DELETE"

        });

        const data = await response.json();

        alert(data.message);

        loadMembers();

        updateStatistics();

    }

    catch(error){

        console.log(error);

    }

}

async function searchMember(){

    const keyword = document
    .getElementById("searchMember")
    .value
    .toLowerCase();

    const response = await fetch("/members/all");

    const members = await response.json();

    const filtered = members.filter(member =>

        member.name.toLowerCase().includes(keyword) ||

        member.phone.includes(keyword)

    );

    const table = document.getElementById("memberTable");

    table.innerHTML = "";

    if(filtered.length===0){

        table.innerHTML=`

        <tr>

            <td colspan="6" class="text-center py-4">

                No Member Found

            </td>

        </tr>

        `;

        return;

    }

    filtered.forEach(member=>{

        const statusClass =
        member.status==="Active"
        ? "status-active"
        : "status-expired";

        const firstLetter =
        member.name.charAt(0).toUpperCase();

        table.innerHTML += `

        <tr>

            <td><strong>${member.memberId}</strong></td>

            <td>

                <div class="member-info">

                    <div class="member-avatar">

                        ${firstLetter}

                    </div>

                    <div>

                        <h6>${member.name}</h6>

                        <small>${member.email}</small>

                    </div>

                </div>

            </td>

            <td>${member.phone}</td>

            <td>

                <span class="badge bg-warning text-dark">

                    ${member.plan}

                </span>

            </td>

            <td>

                <span class="${statusClass}">

                    ${member.status}

                </span>

            </td>

            <td>

                <button
                class="action-btn view-btn"
                onclick="viewMember('${member._id}')">

                <i class="fa-solid fa-eye"></i>

                </button>

                <button
                class="action-btn edit-btn"
                onclick="editMember('${member._id}')">

                <i class="fa-solid fa-pen"></i>

                </button>

                <button
                class="action-btn delete-btn"
                onclick="deleteMember('${member._id}')">

                <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}