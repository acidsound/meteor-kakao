Kakao = {};

OAuth.registerService('kakao', 2, null, function (query) {

    var requestAccess = getAccessToken(query);
    kakaoAppRegister(requestAccess);
    var identity = JSON.parse(getIdentity(requestAccess));
    identity.properties.name = identity.properties.nickname;
    return {
        serviceData: {
            id: identity.id,
            accessToken: requestAccess.access_token,
            refreshToken: requestAccess.refresh_token,
            expires_in: requestAccess.expires_in,
            scope: requestAccess.scope
        },
        options: {profile: identity.properties}
    };
});

var getAccessToken = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'kakao'});
    if (!config)
        throw new ServiceConfiguration.ConfigError();

    var response;
    try {
        response = HTTP.post(
            "https://kauth.kakao.com/oauth/token", {
                params: {
                    grant_type: 'authorization_code',
                    client_id: config.clientId,
                    redirect_uri: Meteor.absoluteUrl() + "_oauth/kakao",
                    code: query.code
                }
            });
    } catch (err) {
        throw _.extend(new Error("Failed to complete OAuth handshake with Kakao. " + err.message),
            {response: err.response});
    }

    if (response.data.error) { // if the http response was a json object with an error attribute
        throw new Error("Failed to complete OAuth handshake with Kakao. " + response.data.error);
    } else {
        return response.data;
    }
};

var kakaoAppRegister = function (requestAccess) {
    var authorization = requestAccess.token_type + " " + requestAccess.access_token;
    try {
        var response = HTTP.post(
            "https://kapi.kakao.com/v1/user/signup", {
                headers: {
                    Authorization: authorization,
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                }
            });
    } catch (err) {
        console.log("error", err);
    }
};

var getIdentity = function (requestAccess) {
    try {
        var authorization = requestAccess.token_type + " " + requestAccess.access_token;
        var response = HTTP.post(
            "https://kapi.kakao.com/v1/user/me", {
                headers: {
                    Authorization: authorization
                }
            });
        return response.content;
    } catch (err) {
        throw _.extend(new Error("Failed to fetch identity from Kakao. " + response.content),
            {response: err.response});
    }
};

Kakao.retrieveCredential = function (credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};