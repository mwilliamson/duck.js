var duck = require("../");

var testMatcher = function(options) {
    return function(test) {
        var matcher = options.matcher;
        var positives = options.positives;
        var negatives = options.negatives;
        
        positives.forEach(function(positive) {
            test.same(true, matcher.matches(positive));
            var result = matcher.matchesWithDescription(positive);
            test.same(true, result.matches);
            test.same("", result.description);
        });
        negatives.forEach(function(negative) {
            test.same(false, matcher.matches(negative.value));
            test.same(negative.description, matcher.describeMismatch(negative.value));
            var result = matcher.matchesWithDescription(negative.value);
            test.same(false, result.matches);
            test.same(negative.description, result.description);
        });
        
        test.done();
    };
};

exports.isMatchesValueUsingTripleEquals = testMatcher({
    matcher: duck.is(1),
    positives: [1],
    negatives: [
        {value: 2, description: "was 2"},
        {value: "1", description: "was '1'"},
        {value: null, description: "was null"}
    ]
});

exports.isDoesNothingToMatchers = testMatcher({
    matcher: duck.is(duck.is(1)),
    positives: [1],
    negatives: [
        {value: 2, description: "was 2"},
        {value: "1", description: "was '1'"},
        {value: null, description: "was null"}
    ]
});

exports.isObjectMatchesValuesExactly = testMatcher({
    matcher: duck.isObject({
        name: "Bob",
        age: 24
    }),
    positives: [{name: "Bob", age: 24}],
    negatives: [
        {value: {name: "Bob"}, description: "missing property: age"},
        {value: {}, description: "missing property: age\nmissing property: name"},
        {value: {name: "bob", age: 24}, description: "name was 'bob'"},
        {value: {name: "Bob", age: 24, hair: "none"}, description: "unexpected property: hair"}
    ]
});
