class Technology {
    constructor(id,name){
        this.id = id;
        this.name = name;
    }
    
    validate() {
        if (!this.name || this.name.trim() === '') {
            throw new Error('Technology name cannot be empty');
        }
        return true;
    }

    getDetails(){
        return {
            id : this.id,
            name : this.name,
        }
    }
}