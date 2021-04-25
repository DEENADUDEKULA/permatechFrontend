
module.exports.getCustomers = async () => {
    console.log("fasafsadfsa")
    return new Promise(async function (resolve, reject) {
        fetch('http://localhost:8032/getCustomerDetails?auth_company_id=1')
        .then(response => response.json())
        .then(data =>resolve(data));
    })
}

module.exports.editProduct = async (order_id , product_id , quantity, status, user_id) => {
    console.log("order_id , product_id , quantity, status, user_id", order_id , product_id , quantity, status, user_id)
    return new Promise(async function (resolve, reject) {
        fetch(`http://localhost:8032/editOrder?auth_company_id=1&auth_user_id=${user_id}`,{
            method : 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                order_id : order_id , product_id : product_id, quantity, status
            }) 
        })
        .then(response => response.json())
        .then(data =>resolve(data));
    })
}

module.exports.getOrders = async (user_id) => {
    return new Promise(async function (resolve, reject) {
        fetch(`http://localhost:8032/getOrders?auth_company_id=1&auth_user_id=${user_id}`)
        .then(response => response.json())
        .then(data =>resolve(data));
    })
}