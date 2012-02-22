var util = require("util");

exports.is = function(matchValue) {
    return new Matcher({
        matches: function(value) {
            return value === matchValue;
        },
        describeValue: function(value) {
            return "got " + util.inspect(value);
        }
    });
};

var Matcher = function(matcher) {
    this._matcher = matcher;
};

Matcher.prototype.matches = function(value) {
    return this._matcher.matches(value);
};

Matcher.prototype.describeValue = function(value) {
    return this._matcher.describeValue(value);
};

Matcher.prototype.matchesWithDescription = function(value) {
    var isMatch = this.matches(value);
    return {
        matches: isMatch,
        description: isMatch ? "" : this.describeValue(value)
    };
};
