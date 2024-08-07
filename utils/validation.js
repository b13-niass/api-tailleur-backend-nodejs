import validator from "validator/es";

export const emptyField = function (fields){
    const errors = [];
    fields.forEach((field) => {
        if(!validator.isEmpty(field)){
            errors.push({field, message: `${field} is required`});
        }
    });

    return errors;
}