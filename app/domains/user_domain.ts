import UserRepository from "../repositories/user_repository.js";

export default class UserDomain{
    private userRepo : UserRepository;

    constructor(){
        this.userRepo = new UserRepository()
    }

    public async getDetail(id :number){
       // console.log("Inside getdetail of user domain")
        const data=await this.userRepo.getdetail(id)
        return {fullName : data.fullName,email : data.email,id : data.id}
    }

    public async updateUser(id : number,data :{ fullName?: string | undefined,email?: string | undefined,password?: string | undefined}){
        //console.log("Inside user domain updateuser")
        return this.userRepo.updateuser(id,data)
    }

    public async createUser(data : { fullName : string , email : string , password : string}){
        return this.userRepo.createUser(data)
    }

    public async deleteuser(id:number){
        return this.userRepo.deleteUser(id)
    }

    public async getUserByEmail(userEmail : string){
        const {fullName ,email,id}= await this.userRepo.getUserByEmail(userEmail)
        return {fullName ,email,id}
    }

    public async login(data :{email : string , password : string}){
        const res : {OAT :string ,jwtToken :string} = await this.userRepo.login(data.email,data.password)
        return res
    }
}