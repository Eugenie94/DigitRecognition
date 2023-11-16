import React, {useState} from 'react';
import axios from "axios";


const Connexion=()=>{
    const [selctionFichier, setSelctionFichier] = useState(null);
    const [reconnaissanceFichier, setReconnaissanceFichier] = useState("");

    
    const handleChange=(e)=>{
        setSelctionFichier(e.target.files[0]);  
    }
}