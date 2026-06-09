import joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js"
class RegisterDto extends BaseDto {
     static schema = joi.object({
        name:joi.string().trim().required().min(2).max(50),
        email:joi.string().trim().max(100).required().lowercase(),
        password:joi.string().min(8).required().trim().max(100).message("password must contains 8 chars minimum "),
        role:joi.string().valid("customer","seller").default("customer")

     }) 
}

export default RegisterDto;