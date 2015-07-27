Template.configureLoginServiceDialogForKakao.helpers({
    siteUrl: function () {
        return Meteor.absoluteUrl();
    }
});

Template.configureLoginServiceDialogForKakao.fields = function () {
    return [
			{property: 'clientId', label: 'Client ID'}
    ];
};