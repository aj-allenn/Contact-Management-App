let currentPage=1;
const limit= 5;
let editId=null;
let contactsCache=[];


const contactBody=document.querySelector(".contactbody");
const searchInput = document.getElementById("search");
const countryFilter = document.getElementById("countryCode");
const sortSelect = document.getElementById("sort");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("nxt");
const emptymessage=document.getElementById("emptymessage");
const contactsWrapper=document.querySelector(".contactWrapper");
const contactsSection=document.querySelector(".contacts-section");

const searchEmpty = document.getElementById("searchEmpty");

const form=document.getElementById("contactForm");

function phoneValid(phone){
    return /^[7-9][0-9]{9}$/.test(phone);
}

form.addEventListener("submit", async function(e){
    e.preventDefault();
    const name = document.getElementById("name").value;
    const countryCode = document.getElementById("countryCodeInput").value;
    const phone = document.getElementById("phone").value;


    if(!phoneValid(phone)){
        alert("Please enter a valid phone number");
        phone.focus();
        return;
    }

    // phone.addEventListener("input",()=>{
    //     phone.value=phone.value.replace(/[^0-9]/g,"");
    //     if(phone.value.length>10){
    //         phone.value=phone.value.slice(0,10);
    //     }
    //     if(phone.value.length===1 && phone.value[0]==="0"){
    //         alert("phone number cannot start with 0");
    //     }
    // })

    try {
        if(editId){
            const res = await fetch(`/api/contacts/${editId}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({name,countryCode,phone})
            });
            if(!res.ok) console.log("Failed to update contact");
            editId = null;
            form.querySelector("button").textContent = "Add Contact";
        } else {
            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name,countryCode,phone})
            });
            if(!res.ok) console.log("Failed to save contact");
        }

        form.reset();
        loadContacts();
        console.log("Contact saved successfully");

    } catch(error){

        console.error("Error:", error.message);
    }
});




async function loadContacts(){
    try{
        const search=searchInput.value.trim();
        const country = countryFilter.value;
        const sort = sortSelect.value;
        const query = new URLSearchParams({
            search,
            countryCode: country,
            sort,
            page: currentPage,
            limit
        });
       
        const res =await fetch(`/api/contacts?${query.toString()}`);
        const data=await res.json();
        contactsCache = data.contacts || [];
        contactBody.innerHTML ="";

        //empty


        // if(data.total ===0){
        //     emptymessage.style.display="block";
        //     contactsWrapper.style.display="none";
        //     searchEmpty.style.display="none";
        //     return;
        // }

        if(contactsCache.length===0){
            emptymessage.style.display="flex";
            contactsWrapper.style.display="none";
            document.getElementById("filters").style.display="none";
            contactsSection.classList.remove("has-contacts");


            if(search){
                alert("No matching contacts")
            }
            
            return;
        }

        emptymessage.style.display="none";
        contactsWrapper.style.display="block";
        document.getElementById("filters").style.display="flex";
        contactsSection.classList.add("has-contacts");

          contactsCache.forEach(contact=>{
            const div = document.createElement("div");
            div.classList.add("contact-card");

            div.innerHTML=`
            <div class="contact-card-info">
                <h3>${contact.name}</h3>
                <p>${contact.countryCode} ${contact.phone}</p>
            </div>
            <div class="contact-card-actions">
                <button class="btn-edit" onclick ="editContact('${contact._id}')">Edit</button>
                <button class="btn-delete" onclick ="deleteContact('${contact._id}')">Delete</button>
            </div>`;

            contactBody.appendChild(div);
        });

        prevBtn.disabled = currentPage ===1;
        nextBtn.disabled = currentPage === data.pages || data.pages === 0;

    } catch(err){
        console.error("contacts are not loading",err)
    }
}



async function deleteContact(id){
    const confirmDelete= confirm("Do you want to delete the contact");
    if(!confirmDelete)
        return;
    try{
        await fetch (`/api/contacts/${id}`,{method:"DELETE"});
        loadContacts();
    }catch(err){
        console.error("Failed to delete",err)
    }
}
//edit
async function editContact(id) {
    try{
        // const res = await fetch(`/api/contacts`);
        // const data =await res.json();
        const contact = contactsCache.find(c=> c._id===id);

        if(contact){
            document.getElementById("name").value=contact.name;
            document.getElementById("phone").value=contact.phone;
            document.getElementById("countryCodeInput").value=contact.countryCode;
            editId=id;
            form.querySelector("button").textContent = "Update Contact";
        }
    }catch(err){
        console.error(err);
    }
    
}
//filtering

searchInput.addEventListener("input",()=>{
    currentPage=1;
    loadContacts();
});

countryFilter.addEventListener("change",()=>{
    currentPage=1;
    loadContacts();
})

sortSelect.addEventListener("change",()=>{
    currentPage=1;
    loadContacts();
});

prevBtn.addEventListener("click",()=>{
    if(currentPage>1){
        currentPage--;
        loadContacts();
    }
});

nextBtn.addEventListener("click",()=>{
    currentPage++;
    loadContacts();
});

loadContacts();