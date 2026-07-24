
const togglePassword = document.getElementById("togglePassword");

const password = document.getElementById("password");


togglePassword.addEventListener("click",()=>{


    if(password.type === "password"){


        password.type="text";


        togglePassword.innerHTML =
        '<i class="fa-solid fa-eye-slash"></i>';


    }
    else{


        password.type="password";


        togglePassword.innerHTML =
        '<i class="fa-solid fa-eye"></i>';


    }


});





const loginForm = document.getElementById("loginForm");

const loginBtn = document.getElementById("loginBtn");



loginForm.addEventListener("submit", async (e)=>{


    e.preventDefault();



    loginBtn.disabled=true;


    loginBtn.innerHTML=
    `
    <i class="fa-solid fa-spinner fa-spin"></i>
    Checking...
    `;



    const email =
    document.getElementById("email").value;


    const password =
    document.getElementById("password").value;



    try{


        const response = await fetch("/login",{


            method:"POST",


            headers:{


                "Content-Type":"application/json"


            },


            body:JSON.stringify({


                email,

                password


            })


        });



        const data = await response.json();




        if(data.success){


            window.location="/dashboard";


        }

        else{


            alert(data.message);


            loginBtn.disabled=false;


            loginBtn.innerHTML="Login";


        }



    }

    catch(error){


        console.log(error);


        alert("Server error. Try again");


        loginBtn.disabled=false;


        loginBtn.innerHTML="Login";


    }



});