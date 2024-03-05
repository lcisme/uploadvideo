const mysql = require('mysql2')
const { Connection } = require('mysql2/typings/mysql/lib/Connection')


const createUser = (userData, callback) => {
    const checkDuplicatequery = 'Select * form user where email = ?'
    Connection.query(checkDuplicatequery, [userData.email], (error, results) => {
        if(error) {
            callback(error, null);
        }
        if(results.lengthg>0){
            callback(null,null)
        }
    })
}