const BASE_ENDPOINT = "http://localhost:9090/_/api"

export const getBehaviors = async () => {
    const url = `${BASE_ENDPOINT}/behaviors`;
    const res = await fetch(url)
    return res.json()
}

export const getRecords = async () => {
    const url = `${BASE_ENDPOINT}/records`;
    const res = await fetch(url)
    return res.json()
}
