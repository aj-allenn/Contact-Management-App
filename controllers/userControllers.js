import User from "../models/contact.model.js"

export const addContact= async(req,res)=>{
    try{
        const contact = await User.create(req.body);
        res.status(201).json(contact);
    }catch(err){
        res.status(400).json({message:"error occured"})
    }
};

export const getContacts = async (req,res)=>{
    try{
        const { search,countryCode,sort="latest",page=1,limit=5} = req.query;
    

    let query={};

    if(search){
        query.name={ $regex:search, $options:"i"};
    }

    if(countryCode){
        query.countryCode=countryCode;
    }
    let sortOption = sort ==="old" ? {createdAt:1}:{createdAt:-1};

    const skip = (page -1) * limit;
    const contacts = await Contact.find(query).sort(sortOption).skip(skip).limit(Number(limit));
    const total = await Contact.countDocuents(query);
    res.json({contact,total,page,pages:Math.ceil(total/limit)

    });
}catch(err){
    res.status(500).json({message:err.message});
}
};


export const updateContact = async(req,res) =>{
    const updated= await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.json(updated);
};

export const deleteContact = async(req,res) => {
    const deleted = await User.findByIdAndDelete(req.params.id);
    res.json({message:"Contact has been deleted"});
};