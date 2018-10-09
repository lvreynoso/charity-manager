// charity-navigator.js

export default function CharityNavigator(appId, apiKey, baseUrl) {
    this.appId = appId;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
}

CharityNavigator.prototype.test = function() {
    let testString = String(this.baseUrl + "/function?" + "app_id=" + this.appId +
    "&app_key=" + this.apiKey)

    return testString;
};

CharityNavigator.prototype.collection = function(pageSize, pageNum, search) {
    // sort by rating from highest to lowest, for now
    // let sort = "RATING:DESC";
    let rated = "TRUE";
    let collectionString = String(this.baseUrl + "/Organizations?" + "app_id=" +
    this.appId + "&app_key=" + this.apiKey + "&pageSize=" + pageSize + "&pageNum=" +
    pageNum + "&search=" + search + "&rated=" + rated)
    
    return collectionString;

};

CharityNavigator.prototype.organization = function(ein) {
    let organizationString = String(this.baseUrl + "/Organizations/" + ein + "?" +
    "app_id=" + this.appId + "&app_key=" + this.apiKey)

    return organizationString;
};
