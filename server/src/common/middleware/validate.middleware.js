import Apierror from "../utils/api-error.js"

const validate = (Dtoclass) => {
    return (req,res,next) => {
        const {errors, value} = Dtoclass.validate(req.body);

        if(errors){
            throw Apierror.badRequest(errors.join("; "))
        }

        req.body = value;
        next()
    }
}

export default validate