import BaseDto from "../../../common/dto/base.dto.js";
import joi from "joi"

class LoginDto extends BaseDto {
    static schema = joi.object({
        email:joi.string().trim().max(100).required(),
        password:joi.string().min(8).max(100).required()
    })
}

export default LoginDto;