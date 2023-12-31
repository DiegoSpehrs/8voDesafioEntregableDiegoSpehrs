import {usersMongo} from '../../DAL/DAOs/MongoDAOs/usersMongo.dao.js';
import { hashData, compareData } from '../../utils.js';
import CustomError from '../../errors/CustomError.js';
import { ErrorMessage } from '../../errors/error.enum.js';

class UsersService{
    async createUser(user){
        const filterAdmin = "adminCoder@coder.com";
        const {first_name,last_name,username,password,email} = user;
        //const userDB = await usersMongo.findOne(username);
        if(!first_name || !last_name || !username || !password || !email) throw new CustomError(ErrorMessage.USER_DATA_MISSING);
        //if(userDB) throw new Error('user already exists');
        const hashPassword = await hashData(password);
        user.password = hashPassword;
        if(filterAdmin === user.email) {
            user.role = 'admin';

            const newUser = await usersMongo.createOne(user);
            return newUser;
        }else{
            const newUser = await usersMongo.createOne(user);
            return newUser;
        }
    }

    async findUser(email){
       const user = await usersMongo.findOne({email});
       if(!user) throw new CustomError(ErrorMessage.USER_NOT_FOUND);
       return user;
    }

    async findUserLogin(obj){
        const {email, password} = obj;
        if(!email || !password) throw new CustomError(ErrorMessage.USER_DATA_MISSING);
        const userDB = await usersMongo.findOne({email});
        console.log(userDB);
        if(!userDB) throw new CustomError(ErrorMessage.USER_NOT_SINGUP);
        const isPasswordValid = await compareData(password, userDB.password);
        if(!isPasswordValid) throw new CustomError(ErrorMessage.LOGIN_DATA_NOT_VALID);
        return userDB
    }

    logInAuthentication(roles){
        return (req,res, next)=>{
            const rol = req.session.role
            console.log(rol)
            if(!roles.includes(rol)) throw new CustomError(ErrorMessage.USER_DO_NOT_HAVE_PERMISSIONS);
            next()
        }
    }
}

export const userService = new UsersService();