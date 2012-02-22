var util = require("util");

exports.is = function(value) {
    if (value instanceof Matcher) {
        return value;
    } else {
        return equalTo(value);
    }
};

var equalTo = function(matchValue) {
    return new Matcher({
        matches: function(value) {
            return value === matchValue;
        },
        describeMismatch: function(value) {
            return "was " + util.inspect(value);
        }
    });
};

exports.isObject = function(object) {
    return new Matcher({
        matchesWithDescription: function(value) {
            var expectedKeys = ownKeys(object);
            var hasPropertiesResult = exports.hasProperties(object).matchesWithDescription(value);
            
            var unexpectedPropertyMismatches = ownKeys(value).filter(function(key) {
                return expectedKeys.indexOf(key) === -1
            }).map(function(key) {
                return "unexpected property: " + key;
            });
            
            var mismatchDescriptions = 
                (hasPropertiesResult.matches ? [] : [hasPropertiesResult.description])
                .concat(unexpectedPropertyMismatches);
                
            if (mismatchDescriptions.length === 0) {
                return {matches: true};
            } else {
                return {matches: false, description: mismatchDescriptions.join("\n")};
            }
        }
    });
};

exports.hasProperties = function(object) {
    return new Matcher({
        matchesWithDescription: function(value) {
            var expectedKeys = ownKeys(object);
            expectedKeys.sort(function(first, second) {
                if (first < second) {
                    return -1;
                } else if (first > second) {
                    return 1;
                } else {
                    return 0;
                }
            });
            var propertyResults = expectedKeys.map(function(key) {
                var propertyMatcher = exports.is(object[key]);
                if (!objectHasOwnProperty(value, key)) {
                    return {matches: false, description: "missing property: " + key};
                } else if (!propertyMatcher.matches(value[key])) {
                    return {matches: false, description: key + " " + propertyMatcher.describeMismatch(value[key])};
                } else {
                    return {matches: true};
                }
            });
            
            var mismatches = propertyResults.filter(function(result) {
                return !result.matches;
            });
            if (mismatches.length === 0) {
                return {matches: true};
            } else {
                var mismatchDescriptions = mismatches.map(function(mismatch) {
                    return mismatch.description;
                });
                return {matches: false, description: mismatchDescriptions.join("\n")};
            }
        }
    });
};

var Matcher = function(matcher) {
    this._matcher = matcher;
};

Matcher.prototype.matches = function(value) {
    if (this._matcher.matchesWithDescription) {
        return this._matcher.matchesWithDescription(value).matches;
    } else {
        return this._matcher.matches(value);
    }
};

Matcher.prototype.describeMismatch = function(value) {
    if (this._matcher.matchesWithDescription) {
        return this._matcher.matchesWithDescription(value).description;
    } else {
        return this._matcher.describeMismatch(value);
    }
};

Matcher.prototype.matchesWithDescription = function(value) {
    var isMatch = this.matches(value);
    return {
        matches: isMatch,
        description: isMatch ? "" : this.describeMismatch(value)
    };
};

var ownKeys = function(obj) {
    var keys = [];
    for (var key in obj) {
        if (objectHasOwnProperty(obj, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var objectHasOwnProperty = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};
