// const getUserProfile = "Select * From userprofile ";
const createUserQuery = "INSERT INTO userprofile (firstname, lastname, email, password,confirmation_token, created_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
const getUserQuery = "Select * From userprofile where confirmation_token =$1";
const getUserUpdateQuery = `UPDATE userprofile SET confirmed_email = true WHERE confirmation_token = $1 RETURNING *`;

const getAcknowledgmentQuery = `UPDATE userprofile SET is_vaild_domain = true WHERE confirmation_token = $1 RETURNING *`;
module.exports = {
    createUserQuery,
    getUserQuery,
    getUserUpdateQuery,
    getAcknowledgmentQuery
}

