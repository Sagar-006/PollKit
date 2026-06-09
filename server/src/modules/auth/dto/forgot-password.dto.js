import BaseDto from "../../../common/dto/base.dto.js";
import joi from "joi"

class ForgotPasswordDto extends BaseDto {
    static schema = joi.object({
        email:joi.string().email().lowercase().required()
    });
}

export default ForgotPasswordDto;