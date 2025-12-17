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

const form=document.getElementById("contactForm");
form.addEventListener("submit", async function(e){
    e.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const countryCode = document.getElementById("countryCodeInput").value;

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

    } catch(error) {
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

        contactsCache.forEach(contact=>{
            const div = document.createElement("div");
            div.classList.add("contact-card");

            div.innerHTML=`
            <h3>${contact.name}</h3>
            <p>${contact.countryCode} ${contact.phone}</p>
            <button onclick ="editContact('${contact._id}')">Edit</button>
            <button onclick ="deleteContact('${contact._id}')">Delete</button>`;

            contactBody.appendChild(div);
        });

        prevBtn.disabled = currentPage ===1;
        nextBtn.disabled = currentPage === data.pages || data.pages === 0;

    } catch(err){
        console.error("contacts are not loading",err)
    }
}



async function deleteContact(id){
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
            form.querySelector("button").textContent = "update contact";
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