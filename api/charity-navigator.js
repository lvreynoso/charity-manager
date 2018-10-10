// charity-navigator.js
// wrapper around the charity navigator api

export default class CharityNavigator {
    constructor(appId, apiKey, baseUrl) {
        this.appId = appId;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    test() {
        return `${this.baseUrl}/function?app_id=${this.appId}&app_key=${this.apiKey}`
    }

    collection(pageSize, pageNum, search) {
        let rated = "TRUE";

        return `${this.baseUrl}/Organizations?app_id=${this.appId}&app_key=${this.apiKey}` +
                `&pageSize=${pageSize}&pageNum=${pageNum}&search=${search}&rated=${rated}`
    }

    organization(ein) {
        return `${this.baseUrl}/Organizations/${ein}?app_id=${this.appId}&app_key=${this.apiKey}`
    }
}
