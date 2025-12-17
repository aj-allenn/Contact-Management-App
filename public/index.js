// const form=document.getElementById("contactForm");
// form.addEventListener("submit",async function (e){
//     e.preventDefault();

//     const name = document.getElementById("name").value;
//     const phone = document.getElementById("phone").value;
//     const countryCode=document.getElementById("countryCodeInput").value;

//      try{
//      const res= await fetch ("/api/contacts",{
//         method:"POST",
//         headers:{"Content-Type":"application/json"},
//         body:JSON.stringify({name,countryCode,phone})
//     });
//     if(!res.ok){
//         console.log("failed to save contact");
        
//     }
//     form.reset();
//     console.log("contact saved succcessfuly");
// }catch(error){
//     console.error("error", error.message);
// }
// }) ;


// const contactBody=document.querySelector(".contactbody");

// async function loadContacts(){
//     try{
//         const res =await fetch("/api/contacts");
//         const contacts=await res.json();
//         contactBody.innerHTML ="";

//         contacts.forEach(contact=>{
//             const div = document.createElement("div");
//             div.classList.add("contact-card");

//             div.innerHTML=`
//             <h3>${contact.name}</h3>
//             <p>${contact.countryCode} ${contact.phone}</p>
//             <button onclick ="deleteContact('${contact._id}')">Delete</button>`;

//             contactBody.appendChild(div);
//         });

//     } catch(err){
//         console.error("contacts are not loading",err)
//     }
// }
// loadContacts();