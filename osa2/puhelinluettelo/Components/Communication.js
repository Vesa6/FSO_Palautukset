import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => 
        response.data);
}

const create = nameObject => {
    const postRequest = axios.post(baseUrl, nameObject);
    return postRequest.then(response => 
        response.data
    );
}

const deletePerson = id => {
    //${id} is the id of the person to be deleted
    //$ notation gets evaluated as javascript
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => 
        response.data);
}

const update = (id, nameObject) => {
    return axios.put(`${baseUrl}/${id}`, nameObject)
    .then(response => response.data)
    .catch(error => {
        return Promise.reject(error);
    });
};

const communication = {create, getAll, deletePerson, update}

export default communication