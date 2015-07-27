Kakao = {};
// Request Kakao credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Kakao.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'kakao'});
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError());
        return;
    }

    var credentialToken = Random.secret();

    var loginStyle = OAuth._loginStyle('kakao', config, options);

    var loginUrl =
        'https://kauth.kakao.com/oauth/authorize' +
        '?client_id=' + config.clientId +
        '&response_type=code' +
        '&redirect_uri=' + encodeURIComponent(OAuth._redirectUri('kakao', config)) +
        '&state=' + encodeURIComponent(OAuth._stateParam(loginStyle, credentialToken));
    OAuth.launchLogin({
        loginService: "kakao",
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken
    });
};