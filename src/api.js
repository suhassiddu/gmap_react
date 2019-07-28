import axios from 'axios'

export default axios.create({
    baseURL: ' https://earthquake.usgs.gov/'
})
