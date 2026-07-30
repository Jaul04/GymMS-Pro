const trainerForm = document.getElementById("trainerForm");

const trainerTable = document.getElementById("trainerTable");



let trainersData = [];




// Load Trainers

async function loadTrainers(){


    try{


        const response = await fetch("/trainers");


        const data = await response.json();



        if(data.success){


            trainersData = data.trainers;


            displayTrainers(trainersData);


            updateStats(trainersData);


        }



    }

    catch(error){

        console.log(error);

    }



}








// Display Trainers


function displayTrainers(trainers){


    trainerTable.innerHTML="";



    if(trainers.length === 0){


        trainerTable.innerHTML = `

        <tr>

        <td colspan="8" class="text-center">

        No Trainers Available

        </td>

        </tr>

        `;


        return;

    }






    trainers.forEach(trainer=>{


        trainerTable.innerHTML += `


        <tr>


        <td>
        ${trainer.trainerId}
        </td>



        <td>

        <i class="fa-solid fa-user-tie text-warning"></i>

        ${trainer.name}

        </td>



        <td>

        ${trainer.phone}

        </td>




        <td>

        ${trainer.specialization}

        </td>




        <td>

        ${trainer.experience} Years

        </td>





        <td>

        ₹${trainer.salary}

        </td>





        <td>


        <span class="badge bg-success">

        ${trainer.status}

        </span>


        </td>





        <td>


        <button

        class="btn btn-danger btn-sm"

        onclick="deleteTrainer('${trainer._id}')">


        <i class="fa-solid fa-trash"></i>


        </button>


        </td>




        </tr>



        `;



    });



}









// Add Trainer


trainerForm.addEventListener(
"submit",
async(e)=>{


    e.preventDefault();



    const trainer = {


        trainerId:
        document.getElementById("trainerId").value,


        name:
        document.getElementById("name").value,


        email:
        document.getElementById("email").value,


        phone:
        document.getElementById("phone").value,


        specialization:
        document.getElementById("specialization").value,


        experience:
        document.getElementById("experience").value,


        salary:
        document.getElementById("salary").value



    };







    try{


        const response =
        await fetch(
        "/trainers/add",
        {


            method:"POST",


            headers:{


                "Content-Type":"application/json"

            },


            body:
            JSON.stringify(trainer)


        });






        const data =
        await response.json();





        if(data.success){


            alert(
            "Trainer Added Successfully"
            );



            trainerForm.reset();



            const modal =
            bootstrap.Modal.getInstance(
            document.getElementById("trainerModal")
            );



            modal.hide();



            loadTrainers();


        }

        else{


            alert(data.message);


        }



    }

    catch(error){

        console.log(error);

    }



});









// Delete Trainer


async function deleteTrainer(id){



    let confirmDelete =
    confirm(
    "Delete this trainer?"
    );



    if(!confirmDelete)
    return;





    try{


        const response =
        await fetch(
        `/trainers/${id}`,
        {

            method:"DELETE"

        });





        const data =
        await response.json();




        if(data.success){


            alert(
            "Trainer Deleted"
            );


            loadTrainers();


        }



    }


    catch(error){

        console.log(error);

    }


}








// Search Trainer


document
.getElementById("searchTrainer")
.addEventListener(
"keyup",
function(){


    let value =
    this.value.toLowerCase();




    let filtered =
    trainersData.filter(
    trainer=>


    trainer.name
    .toLowerCase()
    .includes(value)

    ||

    trainer.phone
    .includes(value)


    );




    displayTrainers(filtered);



});










// Update Statistics


function updateStats(data){



    document.getElementById(
    "trainerCount"
    ).innerText =
    data.length;




    document.getElementById(
    "activeTrainer"
    ).innerText =

    data.filter(
    t=>t.status==="Active"
    ).length;





    document.getElementById(
    "specialistCount"
    ).innerText =

    new Set(
    data.map(
    t=>t.specialization
    )
    ).size;





    let totalExp=0;


    data.forEach(t=>{

        totalExp += Number(
        t.experience || 0
        );

    });



    document.getElementById(
    "experienceCount"
    ).innerText =

    data.length
    ?
    Math.round(
    totalExp/data.length
    )+" Yr"

    :
    "0";



}








// Page Load


window.onload = function(){

    loadTrainers();

};