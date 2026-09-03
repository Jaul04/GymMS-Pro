const memberForm = document.getElementById("memberForm");

window.addEventListener("DOMContentLoaded", () => {
    loadMembers();
    updateStatistics();
});

document
    .getElementById("searchMember")
    .addEventListener("keyup", searchMember);

// ==========================
// ADD / UPDATE MEMBER
// ==========================

memberForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const photoFile = document.getElementById("profilePhoto")?.files?.[0];
    if (photoFile && photoFile.size > 5 * 1024 * 1024) { alert("Profile photo must be under 5MB"); return; }
    const profilePhoto = photoFile ? await fileToDataUrl(photoFile) : undefined;

    const member = {
        profilePhoto,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        plan: document.getElementById("plan").value,
        joinDate: document.getElementById("joinDate").value,
        expiryDate: document.getElementById("expiryDate").value
    };

    const id = memberForm.dataset.id;

    let url = "/members/add";
    let method = "POST";

    if (id) {
        url = `/members/update/${id}`;
        method = "PUT";
    }

    try {

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(member)
        });

        const data = await response.json();

        alert(data.message);

        if (data.success) {

            const modal = bootstrap.Modal.getInstance(
                document.getElementById("memberModal")
            );

            if (modal) {
                modal.hide();
            }

            memberForm.reset();

            delete memberForm.dataset.id;

            document.querySelector(".modal-header h4").innerHTML =
                `<i class="fa-solid fa-user-plus"></i> Add Member`;

            await loadMembers();
            await updateStatistics();
        }

    } catch (error) {

        console.log("Save Error:", error);
        alert("Failed to Save Member");

    }

});

// ==========================
// LOAD MEMBERS
// ==========================

async function loadMembers() {

    try {

        const response = await fetch("/members/all");

        const data = await response.json();

        const members = data.members || [];

        const table = document.getElementById("memberTable");

        table.innerHTML = "";

        if (members.length === 0) {

            table.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <i class="fa-solid fa-users fa-3x text-secondary mb-3"></i>
                    <h5>No Members Found</h5>
                </td>
            </tr>
            `;

            return;
        }

        members.forEach(member => {

            const statusClass =
                member.status === "Active"
                    ? "status-active"
                    : "status-expired";

            const firstLetter =
                member.name.charAt(0).toUpperCase();

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
                        onclick="viewMemberProfile('${member._id}')">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        class="action-btn edit-btn"
                        onclick="editMember('${member._id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="action-btn"
                        title="Member QR"
                        onclick="showMemberQR('${member.memberId}', '${String(member.name).replace("'", "\\'")}')">

                        <i class="fa-solid fa-qrcode"></i>

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

    } catch (error) {

        console.log("Load Error:", error);

    }

}
// ==========================
// UPDATE STATISTICS
// ==========================

async function updateStatistics() {

    try {

        const response = await fetch("/members/all");

        const data = await response.json();

        const members = data.members || [];

        document.getElementById("memberCount").innerHTML =
            members.length;

        const active =
            members.filter(m => m.status === "Active").length;

        document.getElementById("activeCount").innerHTML =
            active;

        document.getElementById("expiredCount").innerHTML =
            members.length - active;

        const premium =
            members.filter(m => m.plan === "Yearly").length;

        document.getElementById("premiumCount").innerHTML =
            premium;

    }

    catch (error) {

        console.log("Statistics Error:", error);

    }

}


// ==========================
// EDIT MEMBER
// ==========================

async function editMember(id) {

    try {

        const response = await fetch("/members/all");

        const data = await response.json();

        const members = data.members || [];

        const member = members.find(m => m._id === id);

        if (!member) {

            alert("Member Not Found");

            return;

        }

        document.getElementById("name").value =
            member.name;

        document.getElementById("email").value =
            member.email;

        document.getElementById("phone").value =
            member.phone;

        document.getElementById("plan").value =
            member.plan;

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

    catch (error) {

        console.log("Edit Error:", error);

    }

}


// ==========================
// VIEW MEMBER
// ==========================

async function viewMember(id) {
    return viewMemberProfile(id);
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


// ==========================
// DELETE MEMBER
// ==========================

async function deleteMember(id) {

    if (!confirm("Delete this member?")) return;

    try {

        const response = await fetch(`/members/delete/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        alert(data.message);

        await loadMembers();

        await updateStatistics();

    }

    catch (error) {

        console.log("Delete Error:", error);

    }

}


// ==========================
// SEARCH MEMBER
// ==========================

async function searchMember() {

    try {

        const keyword = document
            .getElementById("searchMember")
            .value
            .toLowerCase();

        const response = await fetch("/members/all");

        const data = await response.json();

        const members = data.members || [];

        const filtered = members.filter(member =>

            member.name.toLowerCase().includes(keyword) ||

            member.phone.includes(keyword)

        );

        const table = document.getElementById("memberTable");

        table.innerHTML = "";

        if (filtered.length === 0) {

            table.innerHTML = `

            <tr>

                <td colspan="6" class="text-center py-4">

                    No Member Found

                </td>

            </tr>

            `;

            return;

        }

        filtered.forEach(member => {

            const statusClass =

                member.status === "Active"

                    ? "status-active"

                    : "status-expired";

            const firstLetter =

                member.name.charAt(0).toUpperCase();

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
                        onclick="viewMemberProfile('${member._id}')">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        class="action-btn edit-btn"
                        onclick="editMember('${member._id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="action-btn"
                        title="Member QR"
                        onclick="showMemberQR('${member.memberId}', '${String(member.name).replace("'", "\\'")}')">

                        <i class="fa-solid fa-qrcode"></i>

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

    catch (error) {

        console.log("Search Error:", error);

    }

}

// ==========================
// MEMBER QR CODE
// ==========================

function showMemberQR(memberId, memberName) {

    const qrBox = document.getElementById("memberQrCode");
    qrBox.innerHTML = "";

    document.getElementById("qrMemberName").textContent = memberName;
    document.getElementById("qrMemberId").textContent = memberId;

    const payload = `GYM_PRO|${memberId}`;

    new QRCode(qrBox, {
        text: payload,
        width: 240,
        height: 240,
        correctLevel: QRCode.CorrectLevel.H
    });

    new bootstrap.Modal(document.getElementById("memberQrModal")).show();
}

function printMemberQR() {

    const qrBox = document.getElementById("memberQrCode");
    const memberName = document.getElementById("qrMemberName").textContent;
    const memberId = document.getElementById("qrMemberId").textContent;

    if (!qrBox || !qrBox.querySelector("img")) return;

    const qrImage = qrBox.querySelector("img").src;
    const win = window.open("", "_blank", "width=500,height=650");

    win.document.write(`
        <!doctype html>
        <html><head><title>Gym Pro Member QR</title>
        <style>
            body{font-family:Arial,sans-serif;text-align:center;padding:40px;}
            h1{margin-bottom:6px;} img{width:300px;height:300px;margin:25px auto;}
            .id{font-size:20px;font-weight:bold;}
        </style></head><body>
        <h1>GYM PRO</h1>
        <h2>${memberName}</h2>
        <div class="id">${memberId}</div>
        <img src="${qrImage}">
        <p>Scan at the Gym Pro reception for attendance.</p>
        </body></html>
    `);

    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
}
