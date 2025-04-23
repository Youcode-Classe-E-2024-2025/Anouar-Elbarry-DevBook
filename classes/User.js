class User{
        constructor(id,name,email,password = null,role){
                this.id = id;
                this.name = name;
                this.email = email;
                this.password = password;
                this.role = role;
        }


        validate(){
            if(!this.name || this.name.trim() === ''){
                throw new Error ('name must be not empty'); 
            }
            return true;
        }
}