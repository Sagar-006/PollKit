import BaseDto from "../../../common/dto/base.dto.js";
import joi from "joi"
class ResetPasswordDto extends BaseDto {
  static schema = joi.object({
    password: joi.string()
      .min(8)
      .pattern(/(?=.*[A-Z])(?=.*\d)/)
      .message(
        "Password must contain at least one uppercase letter and one digit",
      )
      .required(),
  });
}

export default ResetPasswordDto;