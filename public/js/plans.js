const planForm = document.getElementById("planForm");

const planTable = document.getElementById("planTable");

let plansData = [];




// Load Plans

async function loadPlans(){


    try{


        const response =
        await fetch("/plans");


        const data =
        await response.json();



        if(data.success){


            plansData = data.plans;


            displayPlans(plansData);


            updateStats(plansData);


        }


    }

    catch(error){

        console.log(error);

    }


}








// Display Plans


function displayPlans(plans){


    planTable.innerHTML="";



    if(plans.length===0){


        planTable.innerHTML=`

        <tr>

        <td colspan="6" class="text-center">

        No Plans Available

        </td>

        </tr>

        `;


        return;

    }





    plans.forEach(plan=>{


        planTable.innerHTML += `


        <tr>


        <td>

        ${plan.planId}

        </td>


        <td>

        <i class="fa-solid fa-crown text-warning"></i>

        ${plan.name}

        </td>



        <td>

        ${plan.duration} Days

        </td>



        <td>

        ₹${plan.price}

        </td>



        <td>

        <span class="badge bg-success">

        ${plan.status}

        </span>

        </td>




        <td>


        <button

        class="btn btn-danger btn-sm"

        onclick="deletePlan('${plan._id}')">


        <i class="fa-solid fa-trash"></i>


        </button>


        </td>


        </tr>


        `;



    });



}









// Add Plan


planForm.addEventListener(
"submit",
async(e)=>{


    e.preventDefault();



    const plan = {


        planId:
        document.getElementById("planId").value,


        name:
        document.getElementById("name").value,


        duration:
        document.getElementById("duration").value,


        price:
        document.getElementById("price").value



    };






    try{


        const response =
        await fetch(
        "/plans/add",
        {


            method:"POST",


            headers:{


                "Content-Type":
                "application/json"


            },


            body:
            JSON.stringify(plan)


        });







        const data =
        await response.json();





        if(data.success){


            alert(
            "Plan Added Successfully"
            );



            planForm.reset();




            const modal =
            bootstrap.Modal.getInstance(
            document.getElementById("planModal")
            );



            modal.hide();




            loadPlans();



        }


        else{


            alert(data.message);


        }



    }


    catch(error){


        console.log(error);


    }



});











// Delete Plan


async function deletePlan(id){


    let confirmDelete =
    confirm(
    "Delete this plan?"
    );



    if(!confirmDelete)
    return;




    try{


        const response =
        await fetch(

        `/plans/${id}`,

        {

            method:"DELETE"

        }

        );




        const data =
        await response.json();




        if(data.success){


            alert(
            "Plan Deleted"
            );


            loadPlans();


        }



    }


    catch(error){

        console.log(error);

    }


}









// Statistics


function updateStats(plans){



    document.getElementById(
    "planCount"
    ).innerText =
    plans.length;





    document.getElementById(
    "activePlans"
    ).innerText =

    plans.filter(
    p=>p.status==="Active"
    ).length;







    let total=0;


    plans.forEach(p=>{


        total += Number(
            p.price
        );


    });




    document.getElementById(
    "avgPrice"
    ).innerText =

    plans.length
    ?

    "₹"+
    Math.round(
    total/plans.length
    )

    :

    "₹0";



}







// Page Load


window.onload=function(){


    loadPlans();


};