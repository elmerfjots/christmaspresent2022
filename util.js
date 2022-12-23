function getUrlParameters(){
    const queryString = window.location.search.substring(1);
    var jsonObj = null;
    if(queryString.length > 5){
        var decodedStringAtoB = atob(queryString);
        return JSON.parse(decodedStringAtoB);
    }
    return null;
}