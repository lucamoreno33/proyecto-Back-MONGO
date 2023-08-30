class UserDTO {
    constructor(user) {
        this.first_name = user.name;
        this.last_name = user.lastname;
        this.email = user.email;
        this.role = "user";
    }
}

export default UserDTO;
