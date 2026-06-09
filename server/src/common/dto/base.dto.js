import joi from "joi";
class BaseDto {
    static schema = joi.object({});

    static validate(data){
        const{ error , value } = this.schema.validate(data);

        if(error){
            const errors = error.details.map(e => e.message);
            return {error:errors,value:null}
        }

        return {error:null,value}
    }
}

export default BaseDto;