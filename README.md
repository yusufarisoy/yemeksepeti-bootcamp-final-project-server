# Yemeksepeti Bootcamp Final Project Server
RESTful API with Node.js for **Yemeksepeti Bootcamp Final Project**, a food ordering application with **Kotlin**

## Libraries
- Node.js
- Express
- Mysql2
- Jsonwebtoken
- Bcrypt
- Dotenv
- Cors

## Database
I used [AWS RDS](https://aws.amazon.com/rds/) for online database (MySQL).

#### Endpoint
```
https://yemeksepeti-bootcamp-project.herokuapp.com/
```

#### Users
```
POST api/users/login
body {
    "email", "password"
}

POST api/users/register
body {
    "email", "password", "name", "surname"
}

GET api/users/profile
header {
    Authorization: token
}

GET api/users/profile/addresses
header {
    Authorization: token
}

GET api/users/profile/orders
header {
    Authorization: token
}

PUT api/users/profile/change-password
header {
    Authorization: token
}
body {
    "current_password", "new_password"
}

PUT api/users/profile/update
header {
    Authorization: token
}
body {
    "email", "password", "name", "surname"
}

POST api/users/profile/addresses/new
header {
    Authorization: token
}
body {
    "title", "district_id", "address"
}

PUT api/users/profile/addresses/{address_id}/update
header {
    Authorization: token
}
body {
    "title", "district_id", "address"
}

DELETE api/users/profile/addresses/{address_id}/delete
header {
    Authorization: token
}
```

#### Restaurants
```
```