import {useState} from "react";
import FormContext from "./FormContext";

function FormProvider({children}){
    const [form, setForm]=useState({
        username:"",
        email:""
    })
    return(
        <FormContext.Provider value={{form, setForm}}>
            {children}
        </FormContext.Provider>
    );
}
export default FormProvider;